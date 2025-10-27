import { BadRequestException, Injectable } from '@nestjs/common'
import { HashService } from '@shared/services'
import { JwtService } from '@nestjs/jwt'
import { FindUserByEmailRepository } from '@shared/repositories'

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService
  ) {}

  async execute({ email, password }: SignInUseCase.Params): Promise<SignInUseCase.Result> {
    const user = await this.findUserByEmailRepository.execute({ email })

    if (!user) {
      throw new BadRequestException('Invalid credentials.')
    }

    const isPasswordValid = await this.hashService.compare(password, user.password)

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials.')
    }

    const authToken = await this.jwtService.signAsync({ sub: user.id })

    return { authToken }
  }
}

export namespace SignInUseCase {
  export type Params = {
    email: string
    password: string
  }

  export type Result = {
    authToken: string
  }
}
