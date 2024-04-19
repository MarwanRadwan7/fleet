import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'example', description: 'username of the user account' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'password of the user account' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class LoginResponseDto {
  @ApiProperty()
  access_token: {
    token: string;
    expires_in: string;
  };
  refresh_token: string;
}
