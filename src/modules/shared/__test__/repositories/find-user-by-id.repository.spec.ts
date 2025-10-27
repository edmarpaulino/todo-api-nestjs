import { Test, TestingModule } from '@nestjs/testing'
import { mockFindUserByIdRepositoryData, mockFindUserByIdRepositoryResult } from './mocks'
import { PrismaService } from '@shared/services'
import { FindUserByIdRepository } from '@shared/repositories'

describe('FindUserByIdRepository', () => {
  let sut: FindUserByIdRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindUserByIdRepository, PrismaService]
    }).compile()

    sut = module.get<FindUserByIdRepository>(FindUserByIdRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockFindUserByIdRepositoryResult()
    prisma.user.findUnique = jest.fn().mockResolvedValue(expectedResult)
    const data = mockFindUserByIdRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: data.id } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.user.findUnique = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockFindUserByIdRepositoryData())).rejects.toThrow(error)
  })
})
