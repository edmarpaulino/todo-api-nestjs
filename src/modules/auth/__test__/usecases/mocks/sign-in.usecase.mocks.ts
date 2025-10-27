import { SignInUseCase } from '@auth/usecases'

export const mockSignInUseCaseParams = (): SignInUseCase.Params => ({
  email: 'johndove@mail.com',
  password: 'Str0ngP@ssw0rd'
})

export const mockSignInUseCaseResult = (): SignInUseCase.Result => ({
  authToken: 'token'
})
