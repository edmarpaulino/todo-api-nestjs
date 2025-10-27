import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from '@shared/.'
import { AuthModule } from '@auth/.'
import { UserModule } from '@user/.'
import { TodoModule } from '@todo/.'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SharedModule,
    AuthModule,
    UserModule,
    TodoModule
  ]
})
export class AppModule {}
