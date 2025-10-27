import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { FindTodoByIdRepository } from '@todo/repositories'
import { mockFindTodoByIdRepositoryData, mockFindTodoByIdRepositoryResult } from './mocks'

describe('FindTodoByIdRepository', () => {
  let sut: FindTodoByIdRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindTodoByIdRepository, PrismaService]
    }).compile()

    sut = module.get<FindTodoByIdRepository>(FindTodoByIdRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockFindTodoByIdRepositoryResult()
    prisma.todo.findUnique = jest.fn().mockResolvedValue(expectedResult)
    const data = mockFindTodoByIdRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: data.id } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.todo.findUnique = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockFindTodoByIdRepositoryData())).rejects.toThrow(error)
  })
})
