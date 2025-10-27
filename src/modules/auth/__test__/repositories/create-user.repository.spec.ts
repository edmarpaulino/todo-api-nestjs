import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserRepository } from '@auth/repositories'
import { PrismaService } from '@shared/services'
import { mockCreateUserRepositoryData, mockCreateUserRepositoryResult } from './mocks'

describe('CreateUserRepository', () => {
  let sut: CreateUserRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserRepository, PrismaService]
    }).compile()

    sut = module.get<CreateUserRepository>(CreateUserRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockCreateUserRepositoryResult()
    prisma.user.create = jest.fn().mockResolvedValue(expectedResult)
    const data = mockCreateUserRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.user.create).toHaveBeenCalledWith({ data })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.user.create = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockCreateUserRepositoryData())).rejects.toThrow(error)
  })
})
