import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '@user/presentation'
import { DeleteUserUseCase, FindUserByIdUseCase, UpdateUserUseCase } from '@user/usecases'
import {
  mockFindUserByIdUseCaseResult,
  mockUpdateUserUseCaseParams,
  mockUpdateUserUseCaseResult
} from '@user/__test__/usecases/mocks'
import { UpdateUserRequestDto } from '@user/presentation/dto'
import { CurrentUser } from '@shared/decorators'

describe('UserController', () => {
  let sut: UserController
  let updateUserUseCase: UpdateUserUseCase
  let deleteUserUseCase: DeleteUserUseCase
  let findUserByIdUseCase: FindUserByIdUseCase

  const mockUpdateUserUseCase = {
    execute: jest.fn()
  }

  const mockDeleteUserUseCase = {
    execute: jest.fn()
  }

  const mockFindUserByIdUseCase = {
    execute: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase
        },
        {
          provide: DeleteUserUseCase,
          useValue: mockDeleteUserUseCase
        },
        {
          provide: FindUserByIdUseCase,
          useValue: mockFindUserByIdUseCase
        }
      ]
    })
      .overrideProvider(CurrentUser)
      .useValue(() => 'any_id')
      .compile()

    sut = module.get<UserController>(UserController)
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase)
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase)
    findUserByIdUseCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  describe('updateUser', () => {
    it('should call UpdateUserUseCase with correct params', async () => {
      const { id, ...body } = mockUpdateUserUseCaseParams()
      const requestBody: UpdateUserRequestDto = body
      mockUpdateUserUseCase.execute.mockResolvedValueOnce(mockUpdateUserUseCaseResult())

      await sut.updateUser(id, requestBody)

      expect(updateUserUseCase.execute).toHaveBeenCalledWith({ id, ...requestBody })
    })

    it('should return an updated user on success', async () => {
      const updatedUserResult = mockUpdateUserUseCaseResult()
      mockUpdateUserUseCase.execute.mockResolvedValueOnce(updatedUserResult)

      const { id, ...body } = mockUpdateUserUseCaseParams()
      const requestBody: UpdateUserRequestDto = body
      const result = await sut.updateUser(id, requestBody)

      expect(result).toEqual(updatedUserResult)
    })

    it('should throw if UpdateUserUseCase throws', async () => {
      const error = new Error('Test Error')
      mockUpdateUserUseCase.execute.mockRejectedValueOnce(error)

      const { id, ...body } = mockUpdateUserUseCaseParams()
      const requestBody: UpdateUserRequestDto = body
      await expect(sut.updateUser(id, requestBody)).rejects.toThrow(error)
    })
  })

  describe('deleteUser', () => {
    it('should call DeleteUserUseCase with correct params', async () => {
      const id = 'any_id'

      await sut.deleteUser(id)

      expect(deleteUserUseCase.execute).toHaveBeenCalledWith({ id })
    })

    it('should return void on success', async () => {
      const id = 'any_id'

      const result = await sut.deleteUser(id)

      expect(result).toBeUndefined()
    })

    it('should throw if DeleteUserUseCase throws', async () => {
      const id = 'any_id'
      const error = new Error('Test Error')
      mockDeleteUserUseCase.execute.mockRejectedValueOnce(error)

      await expect(sut.deleteUser(id)).rejects.toThrow(error)
    })
  })

  describe('getUser', () => {
    it('should call FindUserByIdUseCase with correct params', async () => {
      const id = 'any_id'
      mockFindUserByIdUseCase.execute.mockResolvedValueOnce(mockFindUserByIdUseCaseResult())

      await sut.getUser(id)

      expect(findUserByIdUseCase.execute).toHaveBeenCalledWith({ id })
    })

    it('should return user data on success', async () => {
      const userResult = mockFindUserByIdUseCaseResult()
      mockFindUserByIdUseCase.execute.mockResolvedValueOnce(userResult)

      const id = 'any_id'
      const result = await sut.getUser(id)

      expect(result).toEqual(userResult)
    })

    it('should throw if FindUserByIdUseCase throws', async () => {
      const id = 'any_id'
      const error = new Error('Test Error')
      mockFindUserByIdUseCase.execute.mockRejectedValueOnce(error)

      await expect(sut.getUser(id)).rejects.toThrow(error)
    })
  })
})
