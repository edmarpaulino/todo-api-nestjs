import { ListTodosByIdRepository } from '@todo/repositories'
import { mockTodo } from './todo.mock'

export const mockListTodosByIdRepositoryData = (): ListTodosByIdRepository.Data => ({
  ids: ['12345']
})

export const mockListTodosByIdRepositoryResult = (): ListTodosByIdRepository.Result => [mockTodo()]
