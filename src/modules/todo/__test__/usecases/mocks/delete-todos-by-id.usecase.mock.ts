import { DeleteTodosByIdUseCase } from '@todo/usecases'

export const mockDeleteTodosByIdUseCaseParams = (): DeleteTodosByIdUseCase.Params => ({
  ids: ['12345'],
  userId: '12345'
})
