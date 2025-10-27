import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class DeleteTodosByIdRequestDto {
  @ApiProperty({
    example: ['12345'],
    description: 'The ID list of todos to delete',
    isArray: true
  })
  @IsArray()
  @IsString({ each: true })
  ids: string[]
}
