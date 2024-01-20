import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

import { Post } from '../post.interface';
import { ApiProperty } from '@nestjs/swagger';

// TODO: add tags option

export class CreatePostDto {
  @ApiProperty({ example: 'example', description: 'content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://example.com/default.png', description: 'media of the post' })
  @IsString()
  @IsOptional()
  @IsUrl()
  media_url: string;

  @ApiProperty({ example: 'example', description: 'mentions on the post' })
  @IsString()
  @IsOptional()
  tags: string;

  @ApiProperty({ example: 90, description: 'latitude of the location of the post' })
  @IsDecimal()
  @IsOptional()
  lat: number;

  @ApiProperty({ example: 90, description: 'longitude of the location of the post' })
  @IsDecimal()
  @IsOptional()
  lng: number;
}

export type CreatePostResponseDto = Post;

export class CreatePostResponseDtoExample {
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
