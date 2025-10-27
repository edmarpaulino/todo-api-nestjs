import { Injectable } from '@nestjs/common'
import { PrismaService } from '@shared/services'
import { User } from '@prisma/client'

@Injectable()
export class FindUserByIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id }: FindUserByIdRepository.Data): Promise<FindUserByIdRepository.Result> {
    return this.prisma.user.findUnique({ where: { id } })
  }
}

export namespace FindUserByIdRepository {
  export type Data = {
    id: string
  }

  export type Result = User | null
}
