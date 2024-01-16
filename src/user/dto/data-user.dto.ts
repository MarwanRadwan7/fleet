import { IsOptional, IsString } from 'class-validator';

// Request Types - Fields Validation
export class UserDataDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  username: string;
}
