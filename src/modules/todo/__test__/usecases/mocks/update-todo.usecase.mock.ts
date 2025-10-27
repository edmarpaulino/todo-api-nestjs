import { UpdateTodoUseCase } from '@todo/usecases'
import { TodoStatus } from '@prisma/client'
import { mockTodo } from '@todo/__test__/repositories/mocks'

export const mockUpdateTodoUseCaseParams = (): UpdateTodoUseCase.Params => ({
  id: '12345',
  userId: '12345',
  title: 'My todo',
  description: 'This is a very important task',
  status: TodoStatus.DOING
})

export const mockUpdateTodoUseCaseResult = (): UpdateTodoUseCase.Result => mockTodo()
