import { Post } from '../post.interface';

export interface GetPostType extends Post {
  likesCount: number;
  commentsCount: number;
}
