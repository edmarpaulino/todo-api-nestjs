import { Module } from '@nestjs/common'
import { SharedModule } from '@shared/.'
import { CreateTodoUseCase, DeleteTodosByIdUseCase, ListTodosByUserIdUseCase, UpdateTodoUseCase } from '@todo/usecases'
import {
  CreateTodoRepository,
  DeleteTodosByIdRepository,
  FindTodoByIdRepository,
  ListTodosByIdRepository,
  ListTodosByUserIdRepository,
  UpdateTodoRepository
} from '@todo/repositories'
import { TodoController } from './presentation'

@Module({
  imports: [SharedModule],
  controllers: [TodoController],
  providers: [
    CreateTodoUseCase,
    CreateTodoRepository,
    ListTodosByUserIdUseCase,
    ListTodosByUserIdRepository,
    UpdateTodoUseCase,
    UpdateTodoRepository,
    FindTodoByIdRepository,
    DeleteTodosByIdUseCase,
    DeleteTodosByIdRepository,
    ListTodosByIdRepository
  ]
})
export class TodoModule {}
