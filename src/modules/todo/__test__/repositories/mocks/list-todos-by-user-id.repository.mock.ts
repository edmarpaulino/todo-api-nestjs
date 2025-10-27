import { ListTodosByUserIdRepository } from '@todo/repositories'
import { mockTodo } from '@todo/__test__/repositories/mocks'

export const mockListTodosByUserIdRepositoryData = (): ListTodosByUserIdRepository.Data => ({
  userId: '12345'
})

export const mockListTodosByUserIdRepositoryResult = (): ListTodosByUserIdRepository.Result => [mockTodo()]
