import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class UpdateUserResponseDto {
  @ApiProperty({
    example: '68fd090e079631a155552393',
    description: 'The id of the user'
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user'
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'The email of the user'
  })
  @IsEmail()
  email: string
}
