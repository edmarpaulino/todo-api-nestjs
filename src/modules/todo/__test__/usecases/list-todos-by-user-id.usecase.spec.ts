import { Test, TestingModule } from '@nestjs/testing'
import { ListTodosByUserIdUseCase } from '@todo/usecases'
import { ListTodosByUserIdRepository } from '@todo/repositories'
import { mockListTodosByUserIdUseCaseParams, mockListTodosByUserIdUseCaseResult } from './mocks'

describe('ListTodosByUserIdUseCase', () => {
  let sut: ListTodosByUserIdUseCase
  let listTodosByUserIdRepository: ListTodosByUserIdRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTodosByUserIdUseCase,
        {
          provide: ListTodosByUserIdRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockListTodosByUserIdUseCaseResult())
          }
        }
      ]
    }).compile()

    sut = module.get<ListTodosByUserIdUseCase>(ListTodosByUserIdUseCase)
    listTodosByUserIdRepository = module.get<ListTodosByUserIdRepository>(ListTodosByUserIdRepository)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should call listTodosByUserIdRepository with correct params', async () => {
    const params = mockListTodosByUserIdUseCaseParams()
    await sut.execute(params)
    expect(listTodosByUserIdRepository.execute).toHaveBeenCalledWith(params)
  })

  it('should return a todo list on success', async () => {
    const result = await sut.execute(mockListTodosByUserIdUseCaseParams())
    expect(result).toEqual(mockListTodosByUserIdUseCaseResult())
  })
})
