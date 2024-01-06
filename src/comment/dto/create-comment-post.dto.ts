import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentPostDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export type CreateCommentPostType = { id: string; comment: string };
