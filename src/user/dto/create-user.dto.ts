import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

import { User } from '../user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'example', description: 'username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'example', description: 'name of the user' })
  @IsString()
  @Length(3, 64)
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'email of the user' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0123456789', description: 'phone of the user' })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'photo.jpg',
    description: 'photo of the user',
    required: false,
    default: 'default.png',
  })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: 'password', description: 'password of the user' })
  @IsString()
  password: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
    description: 'birthdate of the user on  ISO 8601 format',
  })
  @IsString()
  birthDate: string;
}

export type CreateUserResponseDto = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'phone' | 'birthDate' | 'avatar' | 'bio'
>;

export class CreateUserResponseExample {
  @ApiProperty({ example: '01ac844b-1c1d-4676-abe1-efa90b0428e0' })
  id: string;

  @ApiProperty({ example: 'example' })
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  phone: string;

  @ApiProperty({
    example: 'photo.jpg',
  })
  avatar: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
  })
  birth_date: string;

  @ApiProperty({ example: 'null' })
  bio: string;
}
