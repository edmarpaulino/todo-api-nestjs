import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { UpdateTodoRepository } from '@todo/repositories'
import { mockUpdateTodoRepositoryData, mockUpdateTodoRepositoryResult } from './mocks'

describe('UpdateTodoRepository', () => {
  let sut: UpdateTodoRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateTodoRepository, PrismaService]
    }).compile()

    sut = module.get<UpdateTodoRepository>(UpdateTodoRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockUpdateTodoRepositoryResult()
    prisma.todo.update = jest.fn().mockResolvedValue(expectedResult)
    const data = mockUpdateTodoRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.todo.update).toHaveBeenCalledWith({ where: { id: data.id }, data: { ...data, id: undefined } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.todo.update = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockUpdateTodoRepositoryData())).rejects.toThrow(error)
  })
})
