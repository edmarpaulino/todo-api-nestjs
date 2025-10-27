import { FindUserByEmailRepository, FindUserByIdRepository } from '@shared/repositories'
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { HashService } from '@shared/services'
import { UpdateUserRepository } from '@user/repositories'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashService: HashService,
    private readonly updateUserRepository: UpdateUserRepository
  ) {}

  async execute({
    id,
    name,
    email,
    password,
    passwordConfirmation
  }: UpdateUserUseCase.Params): Promise<UpdateUserUseCase.Result> {
    const user = await this.findUserByIdRepository.execute({ id })
    if (!user) {
      throw new ForbiddenException('User not found or unauthorized to perform this action.')
    }

    await this._validateEmail(user, email)
    await this._validatePassword(user, password, passwordConfirmation)

    let hashedPassword = password
    if (password && !(await this.hashService.compare(password, user.password))) {
      hashedPassword = await this.hashService.hash(password)
    }

    const updatedUser = await this.updateUserRepository.execute({ id, name, email, password: hashedPassword })
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email
    }
  }

  private async _validateEmail(
    user: Exclude<FindUserByIdRepository.Result, null>,
    email: string | undefined
  ): Promise<void> {
    if (!email) {
      return
    }

    if (email === user.email) {
      throw new BadRequestException('The new email address cannot be the same as the current one.')
    }

    const isEmailInUse = await this.findUserByEmailRepository.execute({ email })
    if (isEmailInUse) {
      throw new ForbiddenException('This email address is already in use by another account.')
    }
  }

  private async _validatePassword(
    user: Exclude<FindUserByIdRepository.Result, null>,
    password: string | undefined,
    passwordConfirmation: string | undefined
  ): Promise<void> {
    if (!password) {
      return
    }

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Password and password confirmation do not match.')
    }

    const isPasswordUnchanged = await this.hashService.compare(password, user.password)
    if (isPasswordUnchanged) {
      throw new BadRequestException('The new password cannot be the same as your current password.')
    }
  }
}

export namespace UpdateUserUseCase {
  export type Params = {
    id: string
    name?: string
    email?: string
    password?: string
    passwordConfirmation?: string
  }

  export type Result = {
    id: string
    name: string
    email: string
  }
}
