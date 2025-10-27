import { FindTodoByIdRepository } from '@todo/repositories'
import { mockTodo } from './todo.mock'

export const mockFindTodoByIdRepositoryData = (): FindTodoByIdRepository.Data => ({
  id: '12345'
})

export const mockFindTodoByIdRepositoryResult = (): FindTodoByIdRepository.Result => mockTodo()
