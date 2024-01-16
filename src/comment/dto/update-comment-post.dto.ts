import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentPostDto {
  user_id: string;
  comment_id: string;

  @IsNotEmpty()
  @IsString()
  post_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export type UpdateCommentPostResponseDto = { id: string; comment: string };
