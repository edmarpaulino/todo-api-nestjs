import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Todo, TodoStatus } from '@prisma/client'
import { FindTodoByIdRepository, UpdateTodoRepository } from '@todo/repositories'

type Data = {
  title?: string
  description?: string | null
  status?: TodoStatus
}

@Injectable()
export class UpdateTodoUseCase {
  constructor(
    private readonly findTodoByIdRepository: FindTodoByIdRepository,
    private readonly updateTodoRepository: UpdateTodoRepository
  ) {}

  async execute({ id, userId, ...data }: UpdateTodoUseCase.Params): Promise<UpdateTodoUseCase.Result> {
    const todo = await this.findTodoByIdRepository.execute({ id })

    if (!todo) {
      throw new NotFoundException('Todo not found.')
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You are not authorized to update this todo.')
    }

    this._validateData(todo, data)

    return this.updateTodoRepository.execute({ id, ...data })
  }

  private _validateData(currentData: Data, newData: Data): void {
    const hasChange = Object.keys(newData).some((key) => {
      const typedKey = key as keyof Data
      return currentData[typedKey] !== newData[typedKey]
    })

    if (!hasChange && newData.description !== null) {
      throw new BadRequestException('No data to update or data is the same as current.')
    }
  }
}

export namespace UpdateTodoUseCase {
  export type Params = {
    id: string
    userId: string
    title?: string
    description?: string | null
    status?: TodoStatus
  }

  export type Result = Todo
}
