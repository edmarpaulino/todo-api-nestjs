import { Test, TestingModule } from '@nestjs/testing'
import { DeleteTodosByIdUseCase } from '@todo/usecases'
import { DeleteTodosByIdRepository, ListTodosByIdRepository } from '@todo/repositories'
import { mockDeleteTodosByIdUseCaseParams } from './mocks'
import { mockTodo } from '@todo/__test__/repositories/mocks'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

describe('DeleteTodosByIdUseCase', () => {
  let sut: DeleteTodosByIdUseCase
  let listTodosByIdRepository: ListTodosByIdRepository
  let deleteTodosByIdRepository: DeleteTodosByIdRepository

  const mockTodos = [mockTodo()]
  const params = mockDeleteTodosByIdUseCaseParams()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTodosByIdUseCase,
        {
          provide: ListTodosByIdRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTodos)
          }
        },
        {
          provide: DeleteTodosByIdRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined)
          }
        }
      ]
    }).compile()

    sut = module.get<DeleteTodosByIdUseCase>(DeleteTodosByIdUseCase)
    listTodosByIdRepository = module.get<ListTodosByIdRepository>(ListTodosByIdRepository)
    deleteTodosByIdRepository = module.get<DeleteTodosByIdRepository>(DeleteTodosByIdRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should call listTodosByIdRepository with correct params', async () => {
    await sut.execute(params)
    expect(listTodosByIdRepository.execute).toHaveBeenCalledWith({ ids: params.ids })
  })

  it('should throw BadRequestException if no todos are found', async () => {
    jest.spyOn(listTodosByIdRepository, 'execute').mockResolvedValueOnce([])
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(
      new NotFoundException('One or more todos with the provided IDs do not exist.')
    )
  })

  it('should throw ForbiddenException if one or more todos do not belong to the user', async () => {
    jest.spyOn(listTodosByIdRepository, 'execute').mockResolvedValueOnce([{ ...mockTodo(), userId: 'other_user_id' }])
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(
      new ForbiddenException('You are not authorized to delete one or more of these todos.')
    )
  })

  it('should call deleteTodosByIdRepository with correct params', async () => {
    await sut.execute(params)
    expect(deleteTodosByIdRepository.execute).toHaveBeenCalledWith({ ids: params.ids })
  })

  it('should delete todos successfully', async () => {
    const result = await sut.execute(params)
    expect(result).toBeUndefined()
  })
})
