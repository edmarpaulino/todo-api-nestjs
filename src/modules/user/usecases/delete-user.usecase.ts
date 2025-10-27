import { Injectable } from '@nestjs/common'
import { DeleteUserRepository } from '@user/repositories'

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly deleteUserRepository: DeleteUserRepository) {}

  async execute({ id }: DeleteUserUseCase.Params): Promise<DeleteUserUseCase.Result> {
    await this.deleteUserRepository.execute({ id })
  }
}

export namespace DeleteUserUseCase {
  export type Params = {
    id: string
  }

  export type Result = void
}
