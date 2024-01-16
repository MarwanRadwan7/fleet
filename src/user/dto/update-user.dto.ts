import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { User } from '../user.interface';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @Length(3, 64)
  @IsOptional()
  name: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  birthDate: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  location: string;
}

export type UpdateUserResponseDto = Omit<
  User,
  'password' | 'isActive' | 'role' | 'location' | 'created_at' | 'updated_at'
>;
