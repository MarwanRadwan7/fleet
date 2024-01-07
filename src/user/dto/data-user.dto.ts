import { IsOptional, IsString } from 'class-validator';

export class UserDataDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  username: string;
}
