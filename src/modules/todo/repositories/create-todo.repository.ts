import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'

@Injectable()
export class CreateTodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: CreateTodoRepository.Data): Promise<CreateTodoRepository.Result> {
    return this.prisma.todo.create({ data })
  }
}

export namespace CreateTodoRepository {
  export type Data = {
    title: string
    description?: string
    userId: string
  }

  export type Result = Todo
}
