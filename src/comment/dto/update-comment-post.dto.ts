import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentPostDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export type UpdateCommentPostType = { id: string; comment: string };
