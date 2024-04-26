import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
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
  mediaUrl: string;

  @ApiProperty({ example: 'example', description: 'mentions on the post' })
  @IsString()
  @IsOptional()
  tags: string;

  @ApiProperty({ example: 90, description: 'latitude of the location of the post' })
  @IsDecimal()
  @IsOptional()
  lat: string;

  @ApiProperty({ example: 90, description: 'longitude of the location of the post' })
  @IsDecimal()
  @IsOptional()
  lng: string;
}

export class CreatePostResponseDtoExample {
  @ApiProperty({
    example: {
      id: 'beed05c9-0610-468a-9ddd-2fd84821fea5',
      userId: {
        id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      },
      slug: '276653500474',
      content: 'example',
      media_url: null,
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
    userId: {
      id: string;
    };
    slug: string;
    content: string;
    mediaUrl: string;
    hashtags: string;
    tags: string;
    lat: string;
    lng: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    commentsCount: number;
  };
}
