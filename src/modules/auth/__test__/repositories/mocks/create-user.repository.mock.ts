import { mockUser } from '@shared/__test__/repositories/mocks'
import { CreateUserRepository } from '@auth/repositories'

export const mockCreateUserRepositoryData = (): CreateUserRepository.Data => ({
  name: 'John Dove',
  email: 'johndove@mail.com',
  password: 'password'
})

export const mockCreateUserRepositoryResult = (): CreateUserRepository.Result => mockUser()
