import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'
import { ListTodosByUserIdRepository } from '@todo/repositories'

@Injectable()
export class ListTodosByUserIdUseCase {
  constructor(private readonly listTodosByUserIdRepository: ListTodosByUserIdRepository) {}

  async execute({ userId }: ListTodosByUserIdUseCase.Params): Promise<ListTodosByUserIdUseCase.Result> {
    return this.listTodosByUserIdRepository.execute({ userId })
  }
}

export namespace ListTodosByUserIdUseCase {
  export type Params = {
    userId: string
  }

  export type Result = Todo[]
}
