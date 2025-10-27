import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class SignUpRequestDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string

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
    description:
      'The password of the user. It must contain at least one uppercase letter, one lowercase letter, one number, one special character, and have between 8 and 128 characters.',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
  })
  password: string

  @ApiProperty({
    example: 'Str0ngP@ssw0rd',
    description: 'The password confirmation',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  passwordConfirmation: string
}
