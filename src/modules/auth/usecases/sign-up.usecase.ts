import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserRepository } from '@auth/repositories'
import { HashService } from '@shared/services'
import { JwtService } from '@nestjs/jwt'
import { FindUserByEmailRepository } from '@shared/repositories'

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashService: HashService,
    private readonly createUserRepository: CreateUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute({ name, email, password, passwordConfirmation }: SignUpUseCase.Params): Promise<SignUpUseCase.Result> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Password confirmation does not match the password.')
    }

    const userExist = await this.findUserByEmailRepository.execute({ email })

    if (userExist) {
      throw new BadRequestException('The email address is already associated with an account.')
    }

    const hash = await this.hashService.hash(password)

    const { id } = await this.createUserRepository.execute({
      name,
      email,
      password: hash
    })

    const authToken = await this.jwtService.signAsync({ sub: id })

    return { authToken }
  }
}

export namespace SignUpUseCase {
  export type Params = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }

  export type Result = {
    authToken: string
  }
}
