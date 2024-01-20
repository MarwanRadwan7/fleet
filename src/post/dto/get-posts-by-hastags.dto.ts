import { ApiProperty } from '@nestjs/swagger';

export class GetPostsByHashtagsResponseDto {
  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({
    example: {
      id: 'cc0dee72-7d82-4310-bdd9-b9babb141f87',
      user_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      slug: '1705349715553',
      content: 'example',
      media_url: 'https://www.example.com/default.png',
      media_thumbnail: 'https://www.example.com/default.png',
      hashtags: 'life,gg,prog',
      tags: null,
      lat: 90,
      lng: 90,
      edited: false,
      created_at: '2024-01-15T20:15:15.601Z',
      updated_at: '2024-01-15T20:15:15.601Z',
      likes_count: 0,
      comments_count: 0,
    },
  })
  posts: {
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
  }[];
}
