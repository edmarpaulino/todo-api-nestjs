import { CurrentUser } from '@shared/decorators'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { DeleteUserUseCase, FindUserByIdUseCase, UpdateUserUseCase } from '@user/usecases'
import { GetUserResponseDto, UpdateUserRequestDto, UpdateUserResponseDto } from './dto'

@ApiTags('User')
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error'
})
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase
  ) {}

  @Patch('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The user has been successfully updated.',
    type: UpdateUserResponseDto
  })
  @ApiBadRequestResponse({
    description: 'The new email address cannot be the same as the current one.'
  })
  @ApiForbiddenResponse({
    description: 'User not found or unauthorized to perform this action.'
  })
  async updateUser(@CurrentUser('id') id: string, @Body() body: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    return this.updateUserUseCase.execute({ id, ...body })
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@CurrentUser('id') id: string): Promise<void> {
    return this.deleteUserUseCase.execute({ id })
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse({
    description: 'User not found.'
  })
  @ApiResponse({
    description: 'User data',
    type: GetUserResponseDto
  })
  async getUser(@CurrentUser('id') id: string): Promise<GetUserResponseDto> {
    return this.findUserByIdUseCase.execute({ id })
  }
}
