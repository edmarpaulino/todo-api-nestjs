import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { CreateTodoRepository } from '@todo/repositories'
import { mockCreateTodoRepositoryData, mockCreateTodoRepositoryResult } from './mocks'

describe('CreateTodoRepository', () => {
  let sut: CreateTodoRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTodoRepository, PrismaService]
    }).compile()

    sut = module.get<CreateTodoRepository>(CreateTodoRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockCreateTodoRepositoryResult()
    prisma.todo.create = jest.fn().mockResolvedValue(expectedResult)
    const data = mockCreateTodoRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.todo.create).toHaveBeenCalledWith({ data })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.todo.create = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockCreateTodoRepositoryData())).rejects.toThrow(error)
  })
})
