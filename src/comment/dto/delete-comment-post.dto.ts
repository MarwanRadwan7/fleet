import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCommentPostDto {
  @IsNotEmpty()
  @IsString()
  comment_id: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;
}
