import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '@auth/presentation'
import { SignInUseCase, SignUpUseCase } from '@auth/usecases'
import {
  mockSignUpUseCaseParams,
  mockSignUpUseCaseResult,
  mockSignInUseCaseParams,
  mockSignInUseCaseResult
} from '@auth/__test__/usecases/mocks'

describe('AuthController', () => {
  let sut: AuthController
  let signUpUseCase: SignUpUseCase
  let signInUseCase: SignInUseCase

  const mockSignUpUseCase = {
    execute: jest.fn()
  }

  const mockSignInUseCase = {
    execute: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignUpUseCase,
          useValue: mockSignUpUseCase
        },
        {
          provide: SignInUseCase,
          useValue: mockSignInUseCase
        }
      ]
    }).compile()

    sut = module.get<AuthController>(AuthController)
    signUpUseCase = module.get<SignUpUseCase>(SignUpUseCase)
    signInUseCase = module.get<SignInUseCase>(SignInUseCase)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('signUp', () => {
    it('should call SignUpUseCase with correct params', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      mockSignUpUseCase.execute.mockResolvedValueOnce(mockSignUpUseCaseResult())

      await sut.signUp(signUpParams)

      expect(signUpUseCase.execute).toHaveBeenCalledWith(signUpParams)
    })

    it('should return an auth token on success', async () => {
      const signUpResult = mockSignUpUseCaseResult()
      mockSignUpUseCase.execute.mockResolvedValueOnce(signUpResult)

      const result = await sut.signUp(mockSignUpUseCaseParams())

      expect(result).toEqual(signUpResult)
    })

    it('should throw if SignUpUseCase throws', async () => {
      const error = new Error('Test Error')
      mockSignUpUseCase.execute.mockRejectedValueOnce(error)

      await expect(sut.signUp(mockSignUpUseCaseParams())).rejects.toThrow(error)
    })
  })

  describe('signIn', () => {
    it('should call SignInUseCase with correct params', async () => {
      const signInParams = mockSignInUseCaseParams()
      mockSignInUseCase.execute.mockResolvedValueOnce(mockSignInUseCaseResult())

      await sut.signIn(signInParams)

      expect(signInUseCase.execute).toHaveBeenCalledWith(signInParams)
    })

    it('should return an auth token on success', async () => {
      const signInResult = mockSignInUseCaseResult()
      mockSignInUseCase.execute.mockResolvedValueOnce(signInResult)

      const result = await sut.signIn(mockSignInUseCaseParams())

      expect(result).toEqual(signInResult)
    })

    it('should throw if SignInUseCase throws', async () => {
      const error = new Error('Test Error')
      mockSignInUseCase.execute.mockRejectedValueOnce(error)

      await expect(sut.signIn(mockSignInUseCaseParams())).rejects.toThrow(error)
    })
  })
})
