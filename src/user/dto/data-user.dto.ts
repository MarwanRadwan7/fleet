import { IsOptional, IsString } from 'class-validator';

// Request Types - Fields Validation
// Not used in the user module
export class UserDataDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  username: string;
}
