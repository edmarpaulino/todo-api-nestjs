import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: DeleteUserRepository.Data): Promise<DeleteUserRepository.Result> {
    await this.prisma.user.delete({ where: { id } })
  }
}

export namespace DeleteUserRepository {
  export type Data = {
    id: string
  }

  export type Result = void
}
