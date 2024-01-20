import { ApiProperty } from '@nestjs/swagger';

// Response Types
export class GetFeedResponseDto {
  @ApiProperty()
  count: number;

  @ApiProperty({
    example: {
      user_id: 'ab370287-df7d-4049-a518-79b256b55d63',
      user_username: 'user',
      user_name: 'john doe',
      user_avatar: null,
      post_id: 'ae655a6c-d41a-4d93-adb2-c8f2f4aa7914',
      post_slug: '1234456778',
      post_content: 'example',
      post_media_url: 'https://www.example.com/default.png',
      post_created_at: '2024-01-07T18:12:09.680Z',
    },
  })
  posts: {
    user_id: string;
    user_username: string;
    user_name: string;
    user_avatar: string;
    post_id: string;
    post_slug: string;
    post_content: string;
    post_created_at: Date;
    post_updated_at: Date;
  }[];
}
