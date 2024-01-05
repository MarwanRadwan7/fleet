import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { User } from '../user.interface';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @Length(3, 64)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  password: string;

  @IsString()
  birthDate: string;
}

export type CreateUserType = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'phone' | 'birthDate' | 'avatar' | 'bio'
>;
