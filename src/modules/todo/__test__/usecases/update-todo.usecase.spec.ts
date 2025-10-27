import { Test, TestingModule } from '@nestjs/testing'
import { UpdateTodoUseCase } from '@todo/usecases'
import { FindTodoByIdRepository, UpdateTodoRepository } from '@todo/repositories'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { mockUpdateTodoUseCaseParams, mockUpdateTodoUseCaseResult } from '@todo/__test__/usecases/mocks'
import { mockTodo } from '@todo/__test__/repositories/mocks'

describe('UpdateTodoUseCase', () => {
  let sut: UpdateTodoUseCase
  let findTodoByIdRepository: FindTodoByIdRepository
  let updateTodoRepository: UpdateTodoRepository

  // Mocks
  const params = mockUpdateTodoUseCaseParams()
  const mockTodoData = { ...mockTodo(), userId: params.userId }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTodoUseCase,
        {
          provide: FindTodoByIdRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockTodoData)
          }
        },
        {
          provide: UpdateTodoRepository,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUpdateTodoUseCaseResult())
          }
        }
      ]
    }).compile()

    sut = module.get<UpdateTodoUseCase>(UpdateTodoUseCase)
    findTodoByIdRepository = module.get<FindTodoByIdRepository>(FindTodoByIdRepository)
    updateTodoRepository = module.get<UpdateTodoRepository>(UpdateTodoRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should call findTodoByIdRepository with correct id', async () => {
    await sut.execute(params)
    expect(findTodoByIdRepository.execute).toHaveBeenCalledWith({ id: params.id })
  })

  it('should throw NotFoundException if todo is not found', async () => {
    jest.spyOn(findTodoByIdRepository, 'execute').mockResolvedValueOnce(null)
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow(new NotFoundException('Todo not found.'))
  })

  it('should throw ForbiddenException if user is not authorized to update todo', async () => {
    const wrongUserId = 'wrong_user_id'
    const promise = sut.execute({ ...params, userId: wrongUserId })
    await expect(promise).rejects.toThrow(new ForbiddenException('You are not authorized to update this todo.'))
  })

  it('should throw BadRequestException if no data to update or data is the same as current', async () => {
    const promise = sut.execute({
      id: params.id,
      userId: mockTodoData.userId,
      title: mockTodoData.title,
      description: mockTodoData.description,
      status: mockTodoData.status
    } as any as UpdateTodoUseCase.Params)
    await expect(promise).rejects.toThrow(new BadRequestException('No data to update or data is the same as current.'))
  })

  it('should call updateTodoRepository with correct data', async () => {
    await sut.execute(params)
    expect(updateTodoRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      title: params.title,
      description: params.description,
      status: params.status
    })
  })

  it('should return updated todo data on success', async () => {
    const result = await sut.execute(params)
    expect(result).toEqual(mockUpdateTodoUseCaseResult())
  })

  it('should update only title', async () => {
    await sut.execute({ ...params, description: undefined, status: undefined, userId: mockTodoData.userId })
    expect(updateTodoRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      title: params.title
    })
  })

  it('should update only description', async () => {
    await sut.execute({ ...params, title: undefined, status: undefined, userId: mockTodoData.userId })
    expect(updateTodoRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      description: params.description
    })
  })

  it('should update only description to null', async () => {
    await sut.execute({
      ...params,
      title: undefined,
      status: undefined,
      description: null,
      userId: mockTodoData.userId
    })
    expect(updateTodoRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      description: null
    })
  })

  it('should update only status', async () => {
    await sut.execute({ ...params, title: undefined, description: undefined, userId: mockTodoData.userId })
    expect(updateTodoRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      status: params.status
    })
  })

  it('should update description to null', async () => {
    const updatedTodoResult = { ...mockTodoData, description: null }
    jest.spyOn(updateTodoRepository, 'execute').mockResolvedValueOnce(updatedTodoResult)

    const result = await sut.execute({ ...params, description: null })

    expect(updateTodoRepository.execute).toHaveBeenCalledWith({
      id: params.id,
      title: params.title,
      status: params.status,
      description: null
    })
    expect(result).toEqual(updatedTodoResult)
  })

  it('should throw BadRequestException if only userId and id are provided', async () => {
    const promise = sut.execute({ id: params.id, userId: mockTodoData.userId })
    await expect(promise).rejects.toThrow(new BadRequestException('No data to update or data is the same as current.'))
  })
})
