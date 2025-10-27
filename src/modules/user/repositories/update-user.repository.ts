import { PrismaService } from '@shared/services'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class UpdateUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id, name, email, password }: UpdateUserRepository.Data): Promise<UpdateUserRepository.Result> {
    return this.prisma.user.update({ where: { id }, data: { name, email, password } })
  }
}

export namespace UpdateUserRepository {
  export type Data = {
    id: string
    name?: string
    email?: string
    password?: string
  }

  export type Result = User
}
