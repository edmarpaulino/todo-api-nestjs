import { Test, TestingModule } from '@nestjs/testing'
import { FindUserByIdUseCase } from '@user/usecases'
import { FindUserByIdRepository } from '@shared/repositories'
import { NotFoundException } from '@nestjs/common'
import { mockFindUserByIdUseCaseParams } from './mocks'
import { mockUser } from '@shared/__test__/repositories/mocks/user.mock'

describe('FindUserByIdUseCase', () => {
  let sut: FindUserByIdUseCase
  let findUserByIdRepository: FindUserByIdRepository

  const mockUserData = mockUser()
  const params = mockFindUserByIdUseCaseParams()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdUseCase,
        {
          provide: FindUserByIdRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserData)
          }
        }
      ]
    }).compile()

    sut = module.get<FindUserByIdUseCase>(FindUserByIdUseCase)
    findUserByIdRepository = module.get<FindUserByIdRepository>(FindUserByIdRepository)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should call findUserByIdRepository with correct id', async () => {
    await sut.execute(params)
    expect(findUserByIdRepository.execute).toHaveBeenCalledWith({ id: params.id })
  })

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(findUserByIdRepository, 'execute').mockResolvedValueOnce(null)
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new NotFoundException('User not found'))
  })

  it('should return user data on success', async () => {
    const result = await sut.execute(params)
    expect(result).toEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email
    })
  })
})
