import { ApiProperty } from '@nestjs/swagger';

// Response Types
export class GetTopFeedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  media_url: string;

  @ApiProperty()
  media_thumbnail: string;

  @ApiProperty()
  hashtags: string;

  @ApiProperty()
  tags: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  edited: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  likes_count: number;

  @ApiProperty()
  comments_count: number;

  @ApiProperty()
  total_interactions: number;
}
