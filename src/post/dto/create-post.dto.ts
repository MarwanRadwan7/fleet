import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  // @Max(250)
  content: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  media_url: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  media_thumbnail: string;

  @IsString()
  @IsOptional()
  hashtags: string;

  @IsString()
  @IsOptional()
  tags: string;

  @IsDecimal()
  @IsOptional()
  lat: number;

  @IsDecimal()
  @IsOptional()
  lng: number;
}
