import { Post } from 'src/post/post.interface';
import { User } from 'src/user/user.interface';

// Response Types
export type GetFeedResponseDto = Pick<User, 'id' | 'username' | 'name' | 'avatar'> &
  Pick<Post, 'id' | 'content' | 'createdAt' | 'updatedAt'>;