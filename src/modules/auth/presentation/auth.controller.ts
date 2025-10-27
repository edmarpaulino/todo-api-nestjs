import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'
import { SignInUseCase, SignUpUseCase } from '@auth/usecases'
import { SignInRequestDto, SignInResponseDto, SignUpRequestDto, SignUpResponseDto } from './dto'
import { Public } from '@auth/decorators'

@ApiTags('Auth')
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error'
})
@Controller()
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase
  ) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: SignUpResponseDto
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid.'
  })
  async signUp(@Body() body: SignUpRequestDto): Promise<SignUpResponseDto> {
    return this.signUpUseCase.execute(body)
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The user has been successfully authenticated.',
    type: SignInResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials.'
  })
  async signIn(@Body() body: SignInRequestDto): Promise<SignInResponseDto> {
    return this.signInUseCase.execute(body)
  }
}
