import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '@shared/services'

@Injectable()
export class CreateUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: CreateUserRepository.Data): Promise<CreateUserRepository.Result> {
    return this.prisma.user.create({ data })
  }
}

export namespace CreateUserRepository {
  export type Data = {
    name: string
    email: string
    password: string
  }

  export type Result = User
}
