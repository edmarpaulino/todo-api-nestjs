import { mockUser } from '@shared/__test__/repositories/mocks'
import { UpdateUserRepository } from '@user/repositories'

export const mockUpdateUserRepositoryData = (): UpdateUserRepository.Data => ({
  id: '123456',
  name: 'John Dove',
  email: 'john.dove@mail.com',
  password: 'str0ngPassw*rd'
})

export const mockUpdateUserRepositoryResult = (): UpdateUserRepository.Result => mockUser()
