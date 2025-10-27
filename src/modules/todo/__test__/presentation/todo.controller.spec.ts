import { Test, TestingModule } from '@nestjs/testing'
import { TodoController } from '@todo/presentation'
import { CreateTodoUseCase, DeleteTodosByIdUseCase, ListTodosByUserIdUseCase, UpdateTodoUseCase } from '@todo/usecases'
import {
  mockCreateTodoUseCaseParams,
  mockCreateTodoUseCaseResult,
  mockListTodosByUserIdUseCaseParams,
  mockListTodosByUserIdUseCaseResult,
  mockUpdateTodoUseCaseParams,
  mockUpdateTodoUseCaseResult,
  mockDeleteTodosByIdUseCaseParams
} from '@todo/__test__/usecases/mocks'

describe('TodoController', () => {
  let sut: TodoController
  let createTodoUseCase: CreateTodoUseCase
  let listTodosByUserIdUseCase: ListTodosByUserIdUseCase
  let updateTodoUseCase: UpdateTodoUseCase
  let deleteTodosByIdUseCase: DeleteTodosByIdUseCase

  const mockCreateTodoUseCase = {
    execute: jest.fn()
  }

  const mockListTodosByUserIdUseCase = {
    execute: jest.fn()
  }

  const mockUpdateTodoUseCase = {
    execute: jest.fn()
  }

  const mockDeleteTodosByIdUseCase = {
    execute: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: CreateTodoUseCase,
          useValue: mockCreateTodoUseCase
        },
        {
          provide: ListTodosByUserIdUseCase,
          useValue: mockListTodosByUserIdUseCase
        },
        {
          provide: UpdateTodoUseCase,
          useValue: mockUpdateTodoUseCase
        },
        {
          provide: DeleteTodosByIdUseCase,
          useValue: mockDeleteTodosByIdUseCase
        }
      ]
    }).compile()

    sut = module.get<TodoController>(TodoController)
    createTodoUseCase = module.get<CreateTodoUseCase>(CreateTodoUseCase)
    listTodosByUserIdUseCase = module.get<ListTodosByUserIdUseCase>(ListTodosByUserIdUseCase)
    updateTodoUseCase = module.get<UpdateTodoUseCase>(UpdateTodoUseCase)
    deleteTodosByIdUseCase = module.get<DeleteTodosByIdUseCase>(DeleteTodosByIdUseCase)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('createTodo', () => {
    it('should call CreateTodoUseCase with correct params', async () => {
      const { userId, ...body } = mockCreateTodoUseCaseParams()
      mockCreateTodoUseCase.execute.mockResolvedValueOnce(mockCreateTodoUseCaseResult())
      await sut.createTodo(userId, body)
      expect(createTodoUseCase.execute).toHaveBeenCalledWith({ userId, ...body })
    })

    it('should return a todo on success', async () => {
      const { userId, ...body } = mockCreateTodoUseCaseParams()
      const expectedResult = mockCreateTodoUseCaseResult()
      mockCreateTodoUseCase.execute.mockResolvedValueOnce(expectedResult)
      const result = await sut.createTodo(userId, body)
      expect(result).toEqual(expectedResult)
    })

    it('should throw if CreateTodoUseCase throws', async () => {
      const error = new Error('Test Error')
      const { userId, ...body } = mockCreateTodoUseCaseParams()
      mockCreateTodoUseCase.execute.mockRejectedValueOnce(error)
      await expect(sut.createTodo(userId, body)).rejects.toThrow(error)
    })
  })

  describe('listTodosByUserId', () => {
    it('should call ListTodosByUserIdUseCase with correct params', async () => {
      const { userId } = mockListTodosByUserIdUseCaseParams()
      mockListTodosByUserIdUseCase.execute.mockResolvedValueOnce(mockListTodosByUserIdUseCaseResult())
      await sut.listTodosByUserId(userId)
      expect(listTodosByUserIdUseCase.execute).toHaveBeenCalledWith({ userId })
    })

    it('should return a list of todos on success', async () => {
      const { userId } = mockListTodosByUserIdUseCaseParams()
      const expectedResult = mockListTodosByUserIdUseCaseResult()
      mockListTodosByUserIdUseCase.execute.mockResolvedValueOnce(expectedResult)
      const result = await sut.listTodosByUserId(userId)
      expect(result).toEqual(expectedResult)
    })

    it('should throw if ListTodosByUserIdUseCase throws', async () => {
      const error = new Error('Test Error')
      const { userId } = mockListTodosByUserIdUseCaseParams()
      mockListTodosByUserIdUseCase.execute.mockRejectedValueOnce(error)
      await expect(sut.listTodosByUserId(userId)).rejects.toThrow(error)
    })
  })

  describe('updateTodo', () => {
    it('should call UpdateTodoUseCase with correct params', async () => {
      const { userId, id, ...body } = mockUpdateTodoUseCaseParams()
      mockUpdateTodoUseCase.execute.mockResolvedValueOnce(mockUpdateTodoUseCaseResult())
      await sut.updateTodo(userId, id, body)
      expect(updateTodoUseCase.execute).toHaveBeenCalledWith({ id, userId, ...body })
    })

    it('should return an updated todo on success', async () => {
      const { userId, id, ...body } = mockUpdateTodoUseCaseParams()
      const expectedResult = mockUpdateTodoUseCaseResult()
      mockUpdateTodoUseCase.execute.mockResolvedValueOnce(expectedResult)
      const result = await sut.updateTodo(userId, id, body)
      expect(result).toEqual(expectedResult)
    })

    it('should throw if UpdateTodoUseCase throws', async () => {
      const error = new Error('Test Error')
      const { userId, id, ...body } = mockUpdateTodoUseCaseParams()
      mockUpdateTodoUseCase.execute.mockRejectedValueOnce(error)
      await expect(sut.updateTodo(userId, id, body)).rejects.toThrow(error)
    })
  })

  describe('deleteTodos', () => {
    it('should call DeleteTodosByIdUseCase with correct params', async () => {
      const { userId, ids } = mockDeleteTodosByIdUseCaseParams()
      mockDeleteTodosByIdUseCase.execute.mockResolvedValueOnce(undefined)
      await sut.deleteTodos(userId, { ids })
      expect(deleteTodosByIdUseCase.execute).toHaveBeenCalledWith({ userId, ids })
    })

    it('should throw if DeleteTodosByIdUseCase throws', async () => {
      const error = new Error('Test Error')
      const { userId, ids } = mockDeleteTodosByIdUseCaseParams()
      mockDeleteTodosByIdUseCase.execute.mockRejectedValueOnce(error)
      await expect(sut.deleteTodos(userId, { ids })).rejects.toThrow(error)
    })
  })
})
