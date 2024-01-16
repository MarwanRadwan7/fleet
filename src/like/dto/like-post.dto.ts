import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikePostDto {
  user_id: string;

  @IsNotEmpty()
  @IsString()
  post_id: string;
}

export type CreateLikePostResponseDto = { liked: boolean };
