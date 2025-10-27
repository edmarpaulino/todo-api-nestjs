import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

enum TodoStatus {
  DO = 'DO',
  DOING = 'DOING',
  DONE = 'DONE'
}

export class CreateTodoResponseDto {
  @ApiProperty({
    example: '65e04e9c-8e8f-4b0d-8b0e-8e8f4b0d8b0e',
    description: 'The ID of the todo item'
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo item'
  })
  @IsString()
  title: string

  @ApiProperty({
    example: 'Buy milk, eggs, and bread from the supermarket',
    description: 'The detailed description of the todo item',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  description: string | null

  @ApiProperty({
    example: '65e04e9c-8e8f-4b0d-8b0e-8e8f4b0d8b0e',
    description: 'The ID of the user who created the todo item'
  })
  @IsString()
  userId: string

  @ApiProperty({
    enum: ['DO', 'DOING', 'DONE'],
    example: 'DO',
    description: 'The current status of the todo item'
  })
  @IsEnum(TodoStatus)
  status: 'DO' | 'DOING' | 'DONE'
}
