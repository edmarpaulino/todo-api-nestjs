import { CreateTodoUseCase } from '@todo/usecases'
import { mockTodo } from '@todo/__test__/repositories/mocks'

export const mockCreateTodoUseCaseParams = (): CreateTodoUseCase.Params => ({
  title: 'My todo',
  description: 'This is a very important task',
  userId: '12345'
})

export const mockCreateTodoUseCaseResult = (): CreateTodoUseCase.Result => mockTodo()
