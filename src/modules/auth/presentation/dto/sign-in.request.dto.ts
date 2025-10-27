import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInRequestDto {
  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'The email of the user',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    example: 'Str0ngP@ssw0rd',
    description: 'The password of the user',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
