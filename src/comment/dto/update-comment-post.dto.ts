import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentPostDto {
  @ApiProperty({ example: 'cc0dee72-7d82-4310-bdd9-b9babb141f87' })
  user_id: string;
  comment_id: string;

  @ApiProperty({ example: 'cc0dee72-7d82-4310-bdd9' })
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @ApiProperty({ example: 'example' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
export class UpdateCommentPostResponseDto {
  @ApiProperty({ example: 'cc0dee72-7d82-4310-bdd9' })
  id: string;

  @ApiProperty({ example: 'example' })
  comment: string;
}
