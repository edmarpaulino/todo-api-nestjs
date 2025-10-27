import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'
import { Todo } from '@prisma/client'

@Injectable()
export class FindTodoByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: FindTodoByIdRepository.Data): Promise<FindTodoByIdRepository.Result> {
    return this.prisma.todo.findUnique({ where: { id } })
  }
}

export namespace FindTodoByIdRepository {
  export type Data = {
    id: string
  }

  export type Result = Todo | null
}
