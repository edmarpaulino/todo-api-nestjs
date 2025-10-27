import { SignUpUseCase } from '@auth/usecases'

export const mockSignUpUseCaseParams = (): SignUpUseCase.Params => ({
  name: 'John Dove',
  email: 'johndove@mail.com',
  password: 'Str0ngP@ssw0rd',
  passwordConfirmation: 'Str0ngP@ssw0rd'
})

export const mockSignUpUseCaseResult = (): SignUpUseCase.Result => ({
  authToken: 'token'
})
