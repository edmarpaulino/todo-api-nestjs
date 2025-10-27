import { Module } from '@nestjs/common'
import { SharedModule } from '@shared/.'
import { UserController } from '@user/presentation'
import { DeleteUserUseCase, FindUserByIdUseCase, UpdateUserUseCase } from '@user/usecases'
import { DeleteUserRepository, UpdateUserRepository } from '@user/repositories'

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [UpdateUserUseCase, UpdateUserRepository, DeleteUserUseCase, DeleteUserRepository, FindUserByIdUseCase]
})
export class UserModule {}
