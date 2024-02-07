import { ApiProperty } from '@nestjs/swagger';

// Response Types
export class GetTopFeedResponseDtoExample {
  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({
    example: {
      postId: 'cc0dee72-7d82-4310-bdd9-b9babb141f87',
      userId: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      postSlug: '1705349715553',
      userFirstName: 'example',
      userLastName: 'example',
      username: 'example',
      postContent: 'example',
      userAvatar: 'example.jpg',
      postMediaUrl: 'https://www.example.com/default.png',
      postTags: 'user1,user2',
      postHashtags: 'life,gg,prog',
      postLat: 90,
      postLng: 90,
      postCreatedAt: '2024-01-15T20:15:15.601Z',
      postLikesCount: 1,
      postCommentsCount: 1,
      totalInteractions: 10,
    },
  })
  posts: {
    userId: string;
    username: string;
    userFirstName: string;
    userLastName: string;
    userAvatar: string;
    postId: string;
    postContent: string;
    postSlug: string;
    postTags: string;
    postHashtags: string;
    postMediaUrl: string;
    postCreatedAt: Date;
    postLat: number;
    postLng: number;
    postLikesCount: number;
    postCommentsCount: number;
    totalInteractions: number;
  }[];
}
