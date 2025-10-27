import { Todo, TodoStatus } from '@prisma/client'

export const mockTodo = (): Todo => ({
  id: '12345',
  title: 'My todo',
  description: 'This is a very important task',
  userId: '12345',
  status: TodoStatus.DO
})
