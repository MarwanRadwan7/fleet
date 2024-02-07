import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'example', description: 'username of the user' })
  @IsString()
  @Matches(/^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/, {
    message: 'username must contain only letters, numbers and underscores',
  })
  public username: string;

  @ApiProperty({ example: 'example', description: 'first name of the user' })
  @IsString()
  @Length(3, 64)
  public firstName: string;

  @ApiProperty({ example: 'example', description: 'last name of the user' })
  @IsString()
  @Length(3, 64)
  public lastName: string;

  @ApiProperty({ example: 'user@example.com', description: 'email of the user' })
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({ example: '0123456789', description: 'phone of the user' })
  @IsString()
  public phone: string;

  @ApiProperty({
    example: 'photo.jpg',
    description: 'photo of the user',
    required: false,
    default: 'default.png',
  })
  @IsString()
  @IsOptional()
  public avatar?: string;

  @ApiProperty({ example: 'password', description: 'password of the user' })
  @IsString()
  public password: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
    description: 'birth date of the user on  ISO 8601 format',
  })
  @IsString()
  public birthDate: string;
}

export class CreateUserResponseExample {
  @ApiProperty({ example: '01ac844b-1c1d-4676-abe1-efa90b0428e0' })
  id: string;

  @ApiProperty({ example: 'example' })
  username: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'example' })
  firstName: string;

  @ApiProperty({ example: 'example' })
  lastName: string;

  @ApiProperty({ example: '0123456789' })
  phone: string;

  @ApiProperty({
    example: 'photo.jpg',
  })
  avatar: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
  })
  birthDate: string;

  @ApiProperty({ example: 'null' })
  bio: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
  })
  createdAt: string;
}
