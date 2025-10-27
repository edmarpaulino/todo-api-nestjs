import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTodoRequestDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo item',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    example: 'Buy milk, eggs, and bread from the supermarket',
    description: 'The detailed description of the todo item',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string
}
