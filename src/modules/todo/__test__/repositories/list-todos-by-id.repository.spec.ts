import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { ListTodosByIdRepository } from '@todo/repositories'
import { mockListTodosByIdRepositoryData, mockListTodosByIdRepositoryResult } from './mocks'

describe('ListTodosByIdRepository', () => {
  let sut: ListTodosByIdRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListTodosByIdRepository, PrismaService]
    }).compile()

    sut = module.get<ListTodosByIdRepository>(ListTodosByIdRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockListTodosByIdRepositoryResult()
    prisma.todo.findMany = jest.fn().mockResolvedValue(expectedResult)
    const data = mockListTodosByIdRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.todo.findMany).toHaveBeenCalledWith({ where: { id: { in: data.ids } } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.todo.findMany = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockListTodosByIdRepositoryData())).rejects.toThrow(error)
  })
})
