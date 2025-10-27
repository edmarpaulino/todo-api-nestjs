import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'

@Injectable()
export class ListTodosByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ ids }: ListTodosByIdRepository.Data): Promise<ListTodosByIdRepository.Result> {
    return this.prisma.todo.findMany({ where: { id: { in: ids } } })
  }
}

export namespace ListTodosByIdRepository {
  export type Data = {
    ids: string[]
  }

  export type Result = Todo[]
}
