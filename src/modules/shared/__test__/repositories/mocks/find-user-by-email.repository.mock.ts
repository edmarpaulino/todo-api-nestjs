import { FindUserByEmailRepository } from '@shared/repositories'
import { mockUser } from './user.mock'

export const mockFindUserByEmailRepositoryData = (): FindUserByEmailRepository.Data => ({
  email: 'johndove@mail.com'
})

export const mockFindUserByEmailRepositoryResult = (): FindUserByEmailRepository.Result => mockUser()
