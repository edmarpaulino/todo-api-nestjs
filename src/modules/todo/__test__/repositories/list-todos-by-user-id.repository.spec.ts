import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { ListTodosByUserIdRepository } from '@todo/repositories'
import { mockListTodosByUserIdRepositoryData, mockListTodosByUserIdRepositoryResult } from './mocks'

describe('ListTodosByUserIdRepository', () => {
  let sut: ListTodosByUserIdRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListTodosByUserIdRepository, PrismaService]
    }).compile()

    sut = module.get<ListTodosByUserIdRepository>(ListTodosByUserIdRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockListTodosByUserIdRepositoryResult()
    prisma.todo.findMany = jest.fn().mockResolvedValue(expectedResult)
    const data = mockListTodosByUserIdRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.todo.findMany).toHaveBeenCalledWith({ where: { userId: data.userId } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.todo.findMany = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockListTodosByUserIdRepositoryData())).rejects.toThrow(error)
  })
})
