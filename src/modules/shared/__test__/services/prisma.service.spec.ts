import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@shared/services/prisma.service'

describe('PrismaService', () => {
  let sut: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile()

    sut = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('onModuleInit', () => {
    it('should call $connect when module initializes', async () => {
      const connectSpy = jest.spyOn(sut, '$connect').mockResolvedValue(undefined)

      await sut.onModuleInit()

      expect(connectSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed')
      jest.spyOn(sut, '$connect').mockRejectedValue(error)

      await expect(sut.onModuleInit()).rejects.toThrow('Connection failed')
    })
  })

  describe('onModuleDestroy', () => {
    it('should call $disconnect when module is destroyed', async () => {
      const disconnectSpy = jest.spyOn(sut, '$disconnect').mockResolvedValue(undefined)

      await sut.onModuleDestroy()

      expect(disconnectSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed')
      jest.spyOn(sut, '$disconnect').mockRejectedValue(error)

      await expect(sut.onModuleDestroy()).rejects.toThrow('Disconnection failed')
    })
  })
})
