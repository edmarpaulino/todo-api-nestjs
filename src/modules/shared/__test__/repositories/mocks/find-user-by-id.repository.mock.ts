import { FindUserByIdRepository } from '@shared/repositories'
import { mockUser } from './user.mock'

export const mockFindUserByIdRepositoryData = (): FindUserByIdRepository.Data => ({
  id: '12345'
})

export const mockFindUserByIdRepositoryResult = (): FindUserByIdRepository.Result => mockUser()
