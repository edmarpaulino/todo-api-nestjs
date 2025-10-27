import { mockUser } from '@app/modules/shared/__test__/repositories/mocks'
import { FindUserByIdUseCase } from '@user/usecases'

export const mockFindUserByIdUseCaseParams = (): FindUserByIdUseCase.Params => ({
  id: '12345'
})

export const mockFindUserByIdUseCaseResult = (): FindUserByIdUseCase.Result => mockUser()
