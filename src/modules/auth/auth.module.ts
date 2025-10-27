import { Module } from '@nestjs/common'
import { AuthController } from '@auth/presentation'
import { CreateUserRepository } from '@auth/repositories'
import { SignInUseCase, SignUpUseCase } from '@auth/usecases'
import { SharedModule } from '@shared/.'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@auth/guards'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET')
        if (!secret) {
          throw new Error('JWT_SECRET is not defined')
        }
        return {
          secret,
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN', '1h')
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    CreateUserRepository,
    SignInUseCase,
    SignUpUseCase,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AuthModule {}
