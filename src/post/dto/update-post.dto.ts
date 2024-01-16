import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Post } from '../post.interface';

// Request Types - Fields Validation
export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  tags: string;

  @IsDecimal()
  @IsOptional()
  lat: number;

  @IsDecimal()
  @IsOptional()
  lng: number;

  user_id: string;
  post_id: string;
}

// Response Types
export interface UpdatePostResponseDto extends Post {}
