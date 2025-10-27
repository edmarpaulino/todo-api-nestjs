import { Test, TestingModule } from '@nestjs/testing'
import { SignInUseCase } from '@auth/usecases'
import { HashService } from '@shared/services'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { mockSignInUseCaseParams, mockSignInUseCaseResult } from './mocks'
import { BadRequestException } from '@nestjs/common'
import { FindUserByEmailRepository } from '@shared/repositories'
import { mockUser } from '@shared/__test__/repositories/mocks/user.mock'

describe('SignInUseCase', () => {
  let sut: SignInUseCase
  let findUserByEmailRepository: FindUserByEmailRepository
  let hashService: HashService
  let jwtService: JwtService

  const mockUserData = mockUser()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        {
          provide: FindUserByEmailRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserData)
          }
        },
        {
          provide: HashService,
          useValue: {
            compare: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token')
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

    sut = module.get<SignInUseCase>(SignInUseCase)
    findUserByEmailRepository = module.get<FindUserByEmailRepository>(FindUserByEmailRepository)
    hashService = module.get<HashService>(HashService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should call findUserByEmailRepository with correct email', async () => {
    const params = mockSignInUseCaseParams()
    await sut.execute(params)
    expect(findUserByEmailRepository.execute).toHaveBeenCalledWith({ email: params.email })
  })

  it('should throw BadRequestException if user does not exist', async () => {
    jest.spyOn(findUserByEmailRepository, 'execute').mockResolvedValueOnce(null)
    const params = mockSignInUseCaseParams()
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new BadRequestException('Invalid credentials.'))
  })

  it('should call hashService.compare with correct password and hash', async () => {
    const params = mockSignInUseCaseParams()
    await sut.execute(params)
    expect(hashService.compare).toHaveBeenCalledWith(params.password, mockUserData.password)
  })

  it('should throw BadRequestException if password is invalid', async () => {
    jest.spyOn(hashService, 'compare').mockResolvedValueOnce(false)
    const params = mockSignInUseCaseParams()
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new BadRequestException('Invalid credentials.'))
  })

  it('should call jwtService.signAsync with correct data', async () => {
    const params = mockSignInUseCaseParams()
    await sut.execute(params)
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUserData.id })
  })

  it('should return an authToken on success', async () => {
    const params = mockSignInUseCaseParams()
    const result = await sut.execute(params)
    expect(result).toEqual(mockSignInUseCaseResult())
  })
})
