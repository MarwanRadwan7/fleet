import { Post } from 'src/post/post.interface';

// Response Types
export type GetTopFeedResponseDto = Pick<Post, 'id' | 'content' | 'createdAt' | 'updatedAt'> & {
  total_interactions: string;
};
