import { IsNotEmpty, IsString } from 'class-validator';

import { Comment } from '../comment.interface';

export class GetCommentPostDto {
  @IsNotEmpty()
  @IsString()
  comment_id: string;

  @IsString()
  user_id: string;
}

export interface GetCommentPostResponseDto extends Comment {}
