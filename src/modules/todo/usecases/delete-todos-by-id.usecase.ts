import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { DeleteTodosByIdRepository, ListTodosByIdRepository } from '../repositories'

@Injectable()
export class DeleteTodosByIdUseCase {
  constructor(
    private readonly listTodosByIdRepository: ListTodosByIdRepository,
    private readonly deleteTodosByIdRepository: DeleteTodosByIdRepository
  ) {}

  async execute({ ids, userId }: DeleteTodosByIdUseCase.Params): Promise<DeleteTodosByIdUseCase.Result> {
    const todos = await this.listTodosByIdRepository.execute({ ids })

    if (todos.length === 0) {
      throw new NotFoundException('One or more todos with the provided IDs do not exist.')
    }

    const everyTodoIsUserTodo = todos.every((todo) => todo.userId === userId)
    if (!everyTodoIsUserTodo) {
      throw new ForbiddenException('You are not authorized to delete one or more of these todos.')
    }

    await this.deleteTodosByIdRepository.execute({ ids })
  }
}

export namespace DeleteTodosByIdUseCase {
  export type Params = {
    ids: string[]
    userId: string
  }

  export type Result = void
}
