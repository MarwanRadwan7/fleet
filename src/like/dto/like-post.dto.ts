import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikePostDto {
  @ApiProperty({ example: '0a9fb16e-47d9-4757-b635-d19207da2ee6' })
  @IsNotEmpty()
  @IsString()
  postId: string;
}

export type CreateLikePostResponseDto = { liked: boolean };
