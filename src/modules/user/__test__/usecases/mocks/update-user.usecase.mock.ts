import { UpdateUserUseCase } from '@user/usecases'

export const mockUpdateUserUseCaseParams = (): UpdateUserUseCase.Params => ({
  id: '12345',
  name: 'John Dove',
  email: 'john.dove@mail.com',
  password: '123456',
  passwordConfirmation: '123456'
})

export const mockUpdateUserUseCaseResult = (): UpdateUserUseCase.Result => ({
  id: '12345',
  name: 'John Dove',
  email: 'john.dove@mail.com'
})
