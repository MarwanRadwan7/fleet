import { IsNotEmpty, IsString } from 'class-validator';
import { Post } from '../post.interface';
import { User } from 'src/user/user.interface';
import { Comment } from 'src/comment/comment.interface';
import { ApiProperty } from '@nestjs/swagger';

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

export class GetPostResponseDtoExample {
  @ApiProperty({
    example: {
      id: 'beed05c9-0610-468a-9ddd-2fd84821fea5',
      user_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      slug: '276653500474',
      content: 'example',
      media_url: null,
      media_thumbnail: null,
      hashtags: 'life,pets',
      tags: '',
      lat: 90,
      lng: 90,
      edited: false,
      created_at: '2024-01-01T20:38:01.872Z',
      updated_at: '2024-01-01T20:38:01.872Z',
      likes_count: 0,
      comments_count: 0,
    },
  })
  post: {
    id: string;
    user_id: string;
    slug: string;
    content: string;
    media_url: string;
    media_thumbnail: string;
    hashtags: string;
    tags: string;
    lat: number;
    lng: number;
    edited: boolean;
    created_at: Date;
    updated_at: Date;
    likes_count: number;
    comments_count: number;
  };
}

export class GetPostLikesResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      user_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      username: 'example',
      name: 'example',
      avatar: 'default.png',
    },
  })
  likes: {
    user_id: string;
    username: string;
    name: string;
    avatar: string;
  };
}
export class GetPostCommentsResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      user_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      comment_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      name: 'example',
      avatar: 'default.png',
      content: 'First comment',
      created_at: '2024-01-01T20:38:01.872Z',
      updated_at: '2024-01-01T20:38:01.872Z',
    },
  })
  comments: {
    user_id: string;
    name: string;
    avatar: string;
    comment_id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
  };
}

export class GetPostsByUserResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      id: '747377339-5a30-4e5e-830f-dfb88we1fb',
      slug: '123456789',
      content: 'example',
      media_url: 'example.com/default.png',
      hashtags: 'pets,cats,life',
      lat: '90',
      lng: '90',
      edited: false,
      created_at: '2024-01-01T15:19:19.688Z',
    },
  })
  posts: {
    id: string;
    slug: string;
    content: string;
    media_url: string;
    hashtags: string;
    lat: string;
    lng: string;
    edited: string;
    created_at: Date;
  }[];
}
