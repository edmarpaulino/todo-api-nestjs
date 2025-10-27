import { UpdateTodoRepository } from '@todo/repositories'
import { TodoStatus } from '@prisma/client'
import { mockTodo } from './todo.mock'

export const mockUpdateTodoRepositoryData = (): UpdateTodoRepository.Data => ({
  id: '12345',
  title: 'My todo',
  description: 'This is a very important task',
  status: TodoStatus.DOING
})

export const mockUpdateTodoRepositoryResult = (): UpdateTodoRepository.Result => mockTodo()
