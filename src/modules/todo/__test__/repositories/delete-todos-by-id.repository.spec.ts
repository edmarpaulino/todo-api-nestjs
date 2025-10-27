import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { DeleteTodosByIdRepository } from '@todo/repositories'
import { mockDeleteTodosByIdRepositoryData } from './mocks'

describe('DeleteTodosByIdRepository', () => {
  let sut: DeleteTodosByIdRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteTodosByIdRepository, PrismaService]
    }).compile()

    sut = module.get<DeleteTodosByIdRepository>(DeleteTodosByIdRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    prisma.todo.deleteMany = jest.fn()
    const data = mockDeleteTodosByIdRepositoryData()
    await sut.execute(data)
    expect(prisma.todo.deleteMany).toHaveBeenCalledWith({ where: { id: { in: data.ids } } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.todo.deleteMany = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockDeleteTodosByIdRepositoryData())).rejects.toThrow(error)
  })
})
