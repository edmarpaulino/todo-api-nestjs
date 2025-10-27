import { CreateTodoRepository } from '@todo/repositories'
import { mockTodo } from './todo.mock'

export const mockCreateTodoRepositoryData = (): CreateTodoRepository.Data => ({
  title: 'My todo',
  description: 'This is a very important task',
  userId: '12345'
})

export const mockCreateTodoRepositoryResult = (): CreateTodoRepository.Result => mockTodo()
