import { ApiProperty } from '@nestjs/swagger';

import { Post } from '../post.entity';
import { User } from 'src/user/user.entity';
import { PostComment } from 'src/comment/comment.entity';

// Response Types
export type GetPostLikesResponseDto = { count: number } & {
  likes: User[];
};

export type GetPostCommentsResponseDto = { count: number } & {
  comments: PostComment[];
};

export type GetPostsByUserResponseDto = {
  count: number;
} & { posts: Post[] };

// Response Examples for Swagger-UI
export class GetPostResponseDtoExample {
  @ApiProperty({
    example: {
      id: 'beed05c9-0610-468a-9ddd-2fd84821fea5',
      userId: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      slug: '276653500474',
      content: 'example',
      mediaUrl: null,
      hashtags: 'life,pets',
      tags: '',
      lat: 90,
      lng: 90,
      isEdited: false,
      createdAt: '2024-01-01T20:38:01.872Z',
      updatedAt: '2024-01-01T20:38:01.872Z',
      likesCount: 0,
      commentsCount: 0,
    },
  })
  post: {
    id: string;
    userId: string;
    slug: string;
    content: string;
    mediaUrl: string;
    hashtags: string;
    tags: string;
    lat: number;
    lng: number;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    commentsCount: number;
  };
}

export class GetPostLikesResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      userId: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      username: 'example',
      name: 'example',
      avatar: 'default.png',
    },
  })
  likes: {
    userId: string;
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
      id: '636d87fe-06d7-407b-8dd6-72bf896534f6',
      postId: '21dab6fd-8bbc-4cdb-8aed-2d5777ab42dd',
      userId: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      userFirstName: 'example',
      userLastName: 'example',
      userAvatar: 'default.png',
      content: 'First comment',
      isEdited: false,
      createdAt: '2024-01-01T20:38:01.872Z',
      updatedAt: '2024-01-01T20:38:01.872Z',
    },
  })
  comments: {
    id: string;
    postId: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userAvatar: string;
    content: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
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
      mediaUrl: 'example.com/default.png',
      hashtags: 'pets,cats,life',
      tags: 'user1,user2',
      lat: '90',
      lng: '90',
      isEdited: false,
      createdAt: '2024-01-01T15:19:19.688Z',
      updatedAt: '2024-01-01T15:19:19.688Z',
      likesCount: 1,
      commentsCount: 1,
    },
  })
  posts: {
    id: string;
    slug: string;
    content: string;
    mediaUrl: string;
    hashtags: string;
    tags: string;
    lat: string;
    lng: string;
    isEdited: string;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    commentsCount: number;
  }[];
}
