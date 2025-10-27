import { Test, TestingModule } from '@nestjs/testing'
import { CreateTodoUseCase } from '@todo/usecases'
import { CreateTodoRepository } from '@todo/repositories'
import { mockCreateTodoUseCaseParams, mockCreateTodoUseCaseResult } from './mocks'

describe('CreateTodoUseCase', () => {
  let sut: CreateTodoUseCase
  let createTodoRepository: CreateTodoRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTodoUseCase,
        {
          provide: CreateTodoRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCreateTodoUseCaseResult())
          }
        }
      ]
    }).compile()

    sut = module.get<CreateTodoUseCase>(CreateTodoUseCase)
    createTodoRepository = module.get<CreateTodoRepository>(CreateTodoRepository)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should call createTodoRepository with correct params', async () => {
    const params = mockCreateTodoUseCaseParams()
    await sut.execute(params)
    expect(createTodoRepository.execute).toHaveBeenCalledWith(params)
  })

  it('should return a todo on success', async () => {
    const result = await sut.execute(mockCreateTodoUseCaseParams())
    expect(result).toEqual(mockCreateTodoUseCaseResult())
  })
})
