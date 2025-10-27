import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'
import { Todo, TodoStatus } from '@prisma/client'

@Injectable()
export class UpdateTodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id, ...data }: UpdateTodoRepository.Data): Promise<UpdateTodoRepository.Result> {
    return this.prisma.todo.update({ where: { id }, data })
  }
}

export namespace UpdateTodoRepository {
  export type Data = {
    id: string
    title?: string
    description?: string | null
    status?: TodoStatus
  }

  export type Result = Todo
}
