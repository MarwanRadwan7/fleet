import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { User } from '../user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'example', description: 'username of the user', required: false })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ example: 'example', description: 'name of the user', required: false })
  @IsString()
  @Length(3, 64)
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'email of the user', required: false })
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '0123456789', description: 'phone of the user', required: false })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'password', description: 'password of the user', required: false })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
    description: 'birthdate of the user on  ISO 8601 format',
    required: false,
  })
  @IsString()
  @IsOptional()
  birthDate: string;

  @ApiProperty({ example: 'example', description: 'bio of the user profile', required: false })
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty({ example: 'Cairo', description: 'location in the user profile', required: false })
  @IsString()
  @IsOptional()
  location: string;
}

export type UpdateUserResponseDto = Omit<
  User,
  'password' | 'isActive' | 'role' | 'location' | 'created_at' | 'updated_at'
>;

export class UpdateUserResponseDtoExample {
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

  @ApiProperty({ example: 'example' })
  bio: string;
}
