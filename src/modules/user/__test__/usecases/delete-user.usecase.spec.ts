import { Test, TestingModule } from '@nestjs/testing'
import { DeleteUserUseCase } from '@user/usecases'
import { DeleteUserRepository } from '@user/repositories'
import { mockDeleteUserUseCaseParams } from './mocks'

describe('DeleteUserUseCase', () => {
  let sut: DeleteUserUseCase
  let deleteUserRepository: DeleteUserRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: DeleteUserRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined)
          }
        }
      ]
    }).compile()

    sut = module.get<DeleteUserUseCase>(DeleteUserUseCase)
    deleteUserRepository = module.get<DeleteUserRepository>(DeleteUserRepository)
  })

  it('should call deleteUserRepository with correct id', async () => {
    const params = mockDeleteUserUseCaseParams()
    await sut.execute(params)
    expect(deleteUserRepository.execute).toHaveBeenCalledWith({ id: params.id })
  })

  it('should return void on success', async () => {
    const params = mockDeleteUserUseCaseParams()
    const result = await sut.execute(params)
    expect(result).toBeUndefined()
  })
})
