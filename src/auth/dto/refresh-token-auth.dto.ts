import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
export type RefreshTokenResponseDto = { access_token: string };
