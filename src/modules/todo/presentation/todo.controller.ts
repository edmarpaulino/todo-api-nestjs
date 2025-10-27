import { CurrentUser } from '@shared/decorators'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import {
  CreateTodoRequestDto,
  CreateTodoResponseDto,
  DeleteTodosByIdRequestDto,
  ListTodosByUserIdResponseDto,
  UpdateTodoRequestDto,
  UpdateTodoResponse
} from './dto'
import { CreateTodoUseCase, DeleteTodosByIdUseCase, ListTodosByUserIdUseCase, UpdateTodoUseCase } from '@todo/usecases'

@ApiTags('Todo')
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error'
})
@ApiBearerAuth()
@Controller('todo')
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly listTodosByUserIdUseCase: ListTodosByUserIdUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodosByIdUseCase: DeleteTodosByIdUseCase
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The to do has been successfully created.',
    type: CreateTodoResponseDto
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid.'
  })
  async createTodo(
    @CurrentUser('id') userId: string,
    @Body() body: CreateTodoRequestDto
  ): Promise<CreateTodoResponseDto> {
    return this.createTodoUseCase.execute({ userId, ...body })
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The user todo list',
    type: ListTodosByUserIdResponseDto,
    isArray: true
  })
  async listTodosByUserId(@CurrentUser('id') userId: string): Promise<ListTodosByUserIdResponseDto[]> {
    return this.listTodosByUserIdUseCase.execute({ userId })
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The to do has been successfully updated.',
    type: UpdateTodoResponse
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid.'
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to delete one or more of these todos.'
  })
  @ApiNotFoundResponse({
    description: 'Todo not found.'
  })
  async updateTodo(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: UpdateTodoRequestDto
  ): Promise<UpdateTodoResponse> {
    return this.updateTodoUseCase.execute({ id, userId, ...body })
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    description: 'The todos has been successfully deleted.',
    type: UpdateTodoResponse
  })
  @ApiBadRequestResponse({
    description: 'No data to update or data is the same as current.'
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to update this todo.'
  })
  @ApiNotFoundResponse({
    description: 'One or more todos with the provided IDs do not exist.'
  })
  async deleteTodos(@CurrentUser('id') userId: string, @Body() { ids }: DeleteTodosByIdRequestDto): Promise<void> {
    await this.deleteTodosByIdUseCase.execute({ userId, ids })
  }
}
