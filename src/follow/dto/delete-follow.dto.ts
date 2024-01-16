import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFollowDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  following_id: string;
}
