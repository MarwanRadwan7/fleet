import { IsNotEmpty, IsString } from 'class-validator';
import { Post } from '../post.interface';
import { User } from 'src/user/user.interface';
import { Comment } from 'src/comment/comment.interface';

// Request Types - Fields Validation
export class GetPostDataDto {
  @IsString()
  @IsNotEmpty()
  post_id: string;
}

export class GetPostsByUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

// Response Types
export type GetPostResponseDto = Post & {
  likes_count: number;
  comments_count: number;
};
export type GetPostLikesResponseDto = { count: number } & {
  likes: Pick<User, 'id' | 'username' | 'name' | 'avatar'>[];
};

export type GetPostCommentsResponseDto = { count: number } & {
  comments: Pick<User, 'id' | 'username' | 'name' | 'avatar'>[] &
    Pick<Comment, 'content' | 'createdAt' | 'updatedAt'>[];
};

export type GetPostsByUserResponseDto = {
  count: number;
} & { posts: Omit<Post, 'media_thumbnail' | 'updatedAt' | 'userId'>[] };
