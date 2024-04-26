import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
export class RefreshTokenResponseDto {
  @ApiProperty()
  access_token: string;
}
