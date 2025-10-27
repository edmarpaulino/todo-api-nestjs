import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'

@Injectable()
export class ListTodosByUserIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId }: ListTodosByUserIdRepository.Data): Promise<ListTodosByUserIdRepository.Result> {
    return this.prisma.todo.findMany({ where: { userId } })
  }
}

export namespace ListTodosByUserIdRepository {
  export type Data = {
    userId: string
  }

  export type Result = Todo[]
}
