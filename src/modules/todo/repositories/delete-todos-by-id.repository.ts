import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteTodosByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ ids }: DeleteTodosByIdRepository.Data): Promise<DeleteTodosByIdRepository.Result> {
    await this.prisma.todo.deleteMany({ where: { id: { in: ids } } })
  }
}

export namespace DeleteTodosByIdRepository {
  export type Data = {
    ids: string[]
  }

  export type Result = void
}
