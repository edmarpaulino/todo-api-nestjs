import { Test, TestingModule } from '@nestjs/testing'
import { UpdateUserUseCase } from '@user/usecases'
import { HashService } from '@shared/services'
import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { FindUserByEmailRepository, FindUserByIdRepository } from '@shared/repositories'
import { UpdateUserRepository } from '@user/repositories'
import { mockUpdateUserUseCaseParams } from './mocks'
import { mockUser } from '@shared/__test__/repositories/mocks/user.mock'

describe('UpdateUserUseCase', () => {
  let sut: UpdateUserUseCase
  let findUserByIdRepository: FindUserByIdRepository
  let findUserByEmailRepository: FindUserByEmailRepository
  let hashService: HashService
  let updateUserRepository: UpdateUserRepository

  const mockUserData = mockUser()
  const params = mockUpdateUserUseCaseParams()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: FindUserByIdRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserData)
          }
        },
        {
          provide: FindUserByEmailRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(null)
          }
        },
        {
          provide: HashService,
          useValue: {
            compare: jest.fn().mockResolvedValue(false),
            hash: jest.fn().mockResolvedValue('hashed_password')
          }
        },
        {
          provide: UpdateUserRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserData)
          }
        }
      ]
    }).compile()

    sut = module.get<UpdateUserUseCase>(UpdateUserUseCase)
    findUserByIdRepository = module.get<FindUserByIdRepository>(FindUserByIdRepository)
    findUserByEmailRepository = module.get<FindUserByEmailRepository>(FindUserByEmailRepository)
    hashService = module.get<HashService>(HashService)
    updateUserRepository = module.get<UpdateUserRepository>(UpdateUserRepository)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should call findUserByIdRepository with correct id', async () => {
    await sut.execute(params)
    expect(findUserByIdRepository.execute).toHaveBeenCalledWith({ id: params.id })
  })

  it('should throw ForbiddenException if user not found', async () => {
    jest.spyOn(findUserByIdRepository, 'execute').mockResolvedValueOnce(null)
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(
      new ForbiddenException('User not found or unauthorized to perform this action.')
    )
  })

  it('should call findUserByEmailRepository with correct email if email is provided', async () => {
    await sut.execute(params)
    expect(findUserByEmailRepository.execute).toHaveBeenCalledWith({ email: params.email })
  })

  it('should not call findUserByEmailRepository if email is not provided', async () => {
    await sut.execute({ ...params, email: undefined })
    expect(findUserByEmailRepository.execute).not.toHaveBeenCalled()
  })

  it('should throw BadRequestException if new email is the same as current email', async () => {
    const promise = sut.execute({ ...params, email: mockUserData.email })
    await expect(promise).rejects.toThrow(
      new BadRequestException('The new email address cannot be the same as the current one.')
    )
  })

  it('should throw ForbiddenException if email is already in use', async () => {
    jest.spyOn(findUserByEmailRepository, 'execute').mockResolvedValueOnce(mockUser())
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(
      new ForbiddenException('This email address is already in use by another account.')
    )
  })

  it('should not call hashService.compare if password is not provided', async () => {
    await sut.execute({ ...params, password: undefined, passwordConfirmation: undefined })
    expect(hashService.compare).not.toHaveBeenCalled()
  })

  it('should throw BadRequestException if password and passwordConfirmation do not match', async () => {
    const promise = sut.execute({ ...params, passwordConfirmation: 'wrong_password' })
    await expect(promise).rejects.toThrow(new BadRequestException('Password and password confirmation do not match.'))
  })

  it('should throw BadRequestException if new password is the same as current password', async () => {
    jest.spyOn(hashService, 'compare').mockResolvedValueOnce(true)
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(
      new BadRequestException('The new password cannot be the same as your current password.')
    )
  })

  it('should call hashService.hash with new password if password is provided and different', async () => {
    await sut.execute(params)
    expect(hashService.hash).toHaveBeenCalledWith(params.password)
  })

  it('should call updateUserRepository with correct data', async () => {
    await sut.execute(params)
    expect(updateUserRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      name: params.name,
      email: params.email,
      password: 'hashed_password'
    })
  })

  it('should return updated user data on success', async () => {
    const result = await sut.execute(params)
    expect(result).toEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email
    })
  })
})
