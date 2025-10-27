import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services'
import { DeleteUserRepository } from '@user/repositories'
import { mockDeleteUserRepositoryData } from './mocks'

describe('DeleteUserRepository', () => {
  let sut: DeleteUserRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteUserRepository, PrismaService]
    }).compile()

    sut = module.get<DeleteUserRepository>(DeleteUserRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call prisma correctly', async () => {
    prisma.user.delete = jest.fn()
    const data = mockDeleteUserRepositoryData()
    await sut.execute(data)
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: data.id } })
  })

  it('should throw if prisma throws', async () => {
    const error = new Error('Prisma error')
    prisma.user.delete = jest.fn().mockRejectedValue(error)
    await expect(sut.execute(mockDeleteUserRepositoryData())).rejects.toThrow(error)
  })
})
