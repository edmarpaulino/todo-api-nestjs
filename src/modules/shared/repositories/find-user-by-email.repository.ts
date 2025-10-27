import { Injectable } from '@nestjs/common'
import { PrismaService } from '@shared/services'
import { User } from '@prisma/client'

@Injectable()
export class FindUserByEmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ email }: FindUserByEmailRepository.Data): Promise<FindUserByEmailRepository.Result> {
    return this.prisma.user.findUnique({ where: { email } })
  }
}

export namespace FindUserByEmailRepository {
  export type Data = {
    email: string
  }

  export type Result = User | null
}
