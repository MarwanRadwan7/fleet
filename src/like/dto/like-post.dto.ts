import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikePostDto {
  @IsNotEmpty()
  @IsString()
  postId: string;
}

export type CreateLikePostType = { liked: boolean };
