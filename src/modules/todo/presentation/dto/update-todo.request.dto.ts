import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

enum TodoStatus {
  DO = 'DO',
  DOING = 'DOING',
  DONE = 'DONE'
}

export class UpdateTodoRequestDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo item'
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({
    example: 'Buy milk, eggs, and bread from the supermarket',
    description: 'The detailed description of the todo item',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  description?: string | null

  @ApiProperty({
    enum: ['DO', 'DOING', 'DONE'],
    example: 'DO',
    description: 'The current status of the todo item'
  })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: 'DO' | 'DOING' | 'DONE'
}
