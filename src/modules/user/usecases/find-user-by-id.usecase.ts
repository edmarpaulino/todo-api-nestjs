import { FindUserByIdRepository } from '@shared/repositories'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly findUserByIdRepository: FindUserByIdRepository) {}

  async execute({ id }: FindUserByIdUseCase.Params): Promise<FindUserByIdUseCase.Result> {
    const user = await this.findUserByIdRepository.execute({ id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

export namespace FindUserByIdUseCase {
  export type Params = {
    id: string
  }

  export type Result = {
    id: string
    name: string
    email: string
  }
}
