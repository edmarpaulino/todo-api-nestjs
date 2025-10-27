import { Test, TestingModule } from '@nestjs/testing'
import { mockFindUserByEmailRepositoryData, mockFindUserByEmailRepositoryResult } from './mocks'
import { FindUserByEmailRepository } from '@shared/repositories'
import { PrismaService } from '@shared/services'

describe('FindUserByEmailRepository', () => {
  let sut: FindUserByEmailRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindUserByEmailRepository, PrismaService]
    }).compile()

    sut = module.get<FindUserByEmailRepository>(FindUserByEmailRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockFindUserByEmailRepositoryResult()
    prisma.user.findUnique = jest.fn().mockResolvedValue(expectedResult)
    const data = mockFindUserByEmailRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: data.email } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.user.findUnique = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockFindUserByEmailRepositoryData())).rejects.toThrow(error)
  })
})
