import { IsNotEmpty } from 'class-validator';

export class DeleteCommentPostDto {
  @IsNotEmpty()
  commentId: string;
}
