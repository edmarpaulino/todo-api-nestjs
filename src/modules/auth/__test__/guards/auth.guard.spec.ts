import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@auth/guards'
import { JwtService } from '@nestjs/jwt'
import { IS_PUBLIC_KEY } from '@auth/decorators'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { FindUserByIdRepository } from '@shared/repositories'

describe('AuthGuard', () => {
  let sut: AuthGuard
  let jwtService: JwtService
  let findUserByIdRepository: FindUserByIdRepository
  let reflector: Reflector

  const mockExecutionContext = (headers: Record<string, string> = {}): ExecutionContext => {
    const request = {
      headers,
      user: undefined
    } as Record<string, any>

    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request)
      }),
      getHandler: jest.fn(),
      getClass: jest.fn()
    } as unknown as ExecutionContext
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn()
          }
        },
        {
          provide: FindUserByIdRepository,
          useValue: {
            execute: jest.fn()
          }
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile()

    sut = module.get<AuthGuard>(AuthGuard)
    jwtService = module.get<JwtService>(JwtService)
    findUserByIdRepository = module.get<FindUserByIdRepository>(FindUserByIdRepository)
    reflector = module.get<Reflector>(Reflector)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Public Routes', () => {
    it('should allow access to routes marked with @Public()', async () => {
      const context = mockExecutionContext()
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

      const result = await sut.canActivate(context)

      expect(result).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ])
      expect(jwtService.verifyAsync).not.toHaveBeenCalled()
    })
  })

  describe('Protected Routes', () => {
    it('should throw UnauthorizedException when no token is provided', async () => {
      const context = mockExecutionContext()
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

      await expect(sut.canActivate(context)).rejects.toThrow(new UnauthorizedException('Token not found'))
    })

    it('should throw UnauthorizedException when token format is invalid', async () => {
      const context = mockExecutionContext({ authorization: 'InvalidFormat token123' })
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

      await expect(sut.canActivate(context)).rejects.toThrow(new UnauthorizedException('Token not found'))
    })

    it('should throw UnauthorizedException when token is invalid', async () => {
      const context = mockExecutionContext({ authorization: 'Bearer invalid_token' })
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error())

      await expect(sut.canActivate(context)).rejects.toThrow(new UnauthorizedException('Invalid token'))
    })

    it('should throw UnauthorizedException when user does not exist', async () => {
      const context = mockExecutionContext({ authorization: 'Bearer valid_token' })
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
        sub: 'user-123',
        name: 'John Doe',
        email: 'john@example.com'
      })
      jest.spyOn(findUserByIdRepository, 'execute').mockResolvedValue(null)

      await expect(sut.canActivate(context)).rejects.toThrow(new UnauthorizedException('Invalid token'))
    })

    it('should allow access when token is valid and user exists', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const context = mockExecutionContext({ authorization: 'Bearer valid_token' })

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
        sub: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      })
      jest.spyOn(findUserByIdRepository, 'execute').mockResolvedValue(mockUser)

      const result = await sut.canActivate(context)
      const request = context.switchToHttp().getRequest<Request>()

      expect(result).toBe(true)
      expect(request['user']).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      })
      expect(findUserByIdRepository.execute).toHaveBeenCalledWith({ id: mockUser.id })
    })
  })
})
