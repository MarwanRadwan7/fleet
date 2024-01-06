import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  // @Max(250)
  content: string;

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
