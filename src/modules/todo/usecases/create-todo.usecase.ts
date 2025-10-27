import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'
import { CreateTodoRepository } from '../repositories'

@Injectable()
export class CreateTodoUseCase {
  constructor(private readonly createTodoRepository: CreateTodoRepository) {}

  async execute({ title, description, userId }: CreateTodoUseCase.Params): Promise<CreateTodoUseCase.Result> {
    return this.createTodoRepository.execute({ title, description, userId })
  }
}

export namespace CreateTodoUseCase {
  export type Params = {
    title: string
    description?: string
    userId: string
  }

  export type Result = Todo
}
