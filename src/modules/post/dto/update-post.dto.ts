import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Request Types - Fields Validation
export class UpdatePostDto {
  @ApiProperty({ example: 'example', description: 'content of the post', required: false })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'example', description: 'mentions on the post', required: false })
  @IsString()
  @IsOptional()
  tags: string;

  @ApiProperty({
    example: 90,
    description: 'latitude of the location of the post',
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  lat: string;

  @ApiProperty({
    example: 90,
    description: 'longitude of the location of the post',
    required: false,
  })
  @IsDecimal()
  @IsOptional()
  lng: string;
}

// Response Types
export class UpdatePostResponseDtoExample {
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
      isEdited: true,
      created_at: '2024-01-01T20:38:01.872Z',
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
    created_at: Date;
    updatedAt: Date;
    likesCount: number;
    commentsCount: number;
  };
}
