import { Global, Module } from '@nestjs/common'
import { HashService, PrismaService } from '@shared/services'
import { FindUserByEmailRepository, FindUserByIdRepository } from '@shared/repositories'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, HashService, FindUserByEmailRepository, FindUserByIdRepository],
  exports: [PrismaService, HashService, FindUserByEmailRepository, FindUserByIdRepository]
})
export class SharedModule {}
