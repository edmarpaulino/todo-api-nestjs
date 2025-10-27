import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { UpdateUserRepository } from '@user/repositories'
import { mockUpdateUserRepositoryData, mockUpdateUserRepositoryResult } from './mocks'

describe('UpdateUserRepository', () => {
  let sut: UpdateUserRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateUserRepository, PrismaService]
    }).compile()

    sut = module.get<UpdateUserRepository>(UpdateUserRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    const expectedResult = mockUpdateUserRepositoryResult()
    prisma.user.update = jest.fn().mockResolvedValue(expectedResult)
    const data = mockUpdateUserRepositoryData()
    const result = await sut.execute(data)
    expect(result).toEqual(expectedResult)
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: data.id }, data: { ...data, id: undefined } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.user.update = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockUpdateUserRepositoryData())).rejects.toThrow(error)
  })
})
