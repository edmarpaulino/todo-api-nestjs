import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { HashService } from '@shared/services'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hash')),
  compare: jest.fn(() => Promise.resolve(true))
}))

describe('HashService', () => {
  let sut: HashService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(10)
          }
        }
      ]
    }).compile()

    sut = module.get<HashService>(HashService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('hash', () => {
    it('should hash input correctly', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await expect(sut.hash('value')).resolves.toBe('hash')
      expect(hashSpy).toHaveBeenCalledWith('value', expect.any(Number))
    })

    it('should handle hash errors', async () => {
      const error = new Error('Bcrypt error')
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(error as never)
      const promise = sut.hash('value')
      await expect(promise).rejects.toThrow(error)
    })
  })

  describe('compare', () => {
    it('should compare input correctly', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await expect(sut.compare('value', 'hash')).resolves.toBe(true)
      expect(compareSpy).toHaveBeenCalledWith('value', 'hash')
    })

    it('should handle compare errors', async () => {
      const error = new Error('Bcrypt error')
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(error as never)
      const promise = sut.compare('value', 'hash')
      await expect(promise).rejects.toThrow(error)
    })
  })
})
