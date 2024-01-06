import { IsNotEmpty, IsString } from 'class-validator';

import { Comment } from '../comment.interface';

export class GetCommentPostDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export interface GetCommentPostType extends Comment {}
