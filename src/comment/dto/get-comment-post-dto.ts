import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCommentPostDto {
  @ApiProperty({ example: '0a9fb16e-47d9-4757-b635-d19207da2ee6' })
  @IsNotEmpty()
  @IsString()
  comment_id: string;

  @ApiProperty({ example: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8' })
  @IsString()
  user_id: string;
}

export class GetCommentPostResponseDto {
  @ApiProperty({ example: '0a9fb16e-47d9-4757-b635-d19207da2ee6' })
  id: string;

  @ApiProperty({ example: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8' })
  user_id: string;

  @ApiProperty({ example: '9b4c2140-ce38-4e0c-95c5-972009922dc' })
  postId: string;

  @ApiProperty({ example: 'example' })
  content: string;

  @ApiProperty({ example: true })
  edited: boolean;

  @ApiProperty({ example: '2024-01-16T12:04:49.437Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-16T12:04:49.437Z' })
  updatedAt: Date;
}
