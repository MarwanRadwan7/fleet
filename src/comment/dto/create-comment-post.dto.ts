import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentPostDto {
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  user_id: string;
}

export type CreateCommentPostResponseDto = { id: string; comment: string };
