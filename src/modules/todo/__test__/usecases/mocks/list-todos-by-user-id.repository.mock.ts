import { ListTodosByUserIdUseCase } from '@todo/usecases'
import { mockTodo } from '@todo/__test__/repositories/mocks'

export const mockListTodosByUserIdUseCaseParams = (): ListTodosByUserIdUseCase.Params => ({
  userId: '12345'
})

export const mockListTodosByUserIdUseCaseResult = (): ListTodosByUserIdUseCase.Result => [mockTodo()]
