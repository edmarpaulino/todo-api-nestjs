import { Test, TestingModule } from '@nestjs/testing'
import { SignUpUseCase } from '@auth/usecases'
import { CreateUserRepository } from '@auth/repositories'
import { HashService } from '@shared/services'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { mockSignUpUseCaseParams, mockSignUpUseCaseResult } from './mocks'
import { BadRequestException } from '@nestjs/common'
import { User } from '@prisma/client'
import { FindUserByEmailRepository } from '@shared/repositories'
import { mockUser } from '@shared/__test__/repositories/mocks/user.mock'

describe('SignUpUseCase', () => {
  let sut: SignUpUseCase
  let findUserByEmailRepository: FindUserByEmailRepository
  let hashService: HashService
  let createUserRepository: CreateUserRepository
  let jwtService: JwtService

  const mockUserData = mockUser()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUseCase,
        {
          provide: FindUserByEmailRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(null)
          }
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn().mockResolvedValue('hashed_password')
          }
        },
        {
          provide: CreateUserRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserData)
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

    sut = module.get<SignUpUseCase>(SignUpUseCase)
    findUserByEmailRepository = module.get<FindUserByEmailRepository>(FindUserByEmailRepository)
    hashService = module.get<HashService>(HashService)
    createUserRepository = module.get<CreateUserRepository>(CreateUserRepository)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should throw BadRequestException if password confirmation does not match', async () => {
    const params = mockSignUpUseCaseParams()
    params.passwordConfirmation = 'wrong_password'
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new BadRequestException('Password confirmation does not match the password.'))
  })

  it('should call findUserByEmailRepository with correct email', async () => {
    const params = mockSignUpUseCaseParams()
    await sut.execute(params)
    expect(findUserByEmailRepository.execute).toHaveBeenCalledWith({ email: params.email })
  })

  it('should throw BadRequestException if user already exists', async () => {
    jest.spyOn(findUserByEmailRepository, 'execute').mockResolvedValueOnce({} as User)
    const params = mockSignUpUseCaseParams()
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(
      new BadRequestException('The email address is already associated with an account.')
    )
  })

  it('should call hashService with correct password', async () => {
    const params = mockSignUpUseCaseParams()
    await sut.execute(params)
    expect(hashService.hash).toHaveBeenCalledWith(params.password)
  })

  it('should call createUserRepository with correct data', async () => {
    const params = mockSignUpUseCaseParams()
    await sut.execute(params)
    expect(createUserRepository.execute).toHaveBeenCalledWith({
      name: params.name,
      email: params.email,
      password: 'hashed_password'
    })
  })

  it('should call jwtService with correct data', async () => {
    const params = mockSignUpUseCaseParams()
    await sut.execute(params)
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUserData.id })
  })

  it('should return an authToken on success', async () => {
    const params = mockSignUpUseCaseParams()
    const result = await sut.execute(params)
    expect(result).toEqual(mockSignUpUseCaseResult())
  })
})
