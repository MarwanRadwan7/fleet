import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { FollowsUserDataDto } from 'src/follow/dto';

// Request Types - Fields Validation
export class GetUserDataDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

// Response Types
export type GetUserFollowersResponseDto = { count: number } & { followers: FollowsUserDataDto[] };
export type GetUserFollowingsResponseDto = { count: number } & { followings: FollowsUserDataDto[] };

// Response Examples for Swagger-UI
export class GetUserResponseDtoExample {
  @ApiProperty({ example: '01ac844b-1c1d-4676-abe1-efa90b0428e0' })
  id: string;

  @ApiProperty({ example: 'example' })
  username: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'example' })
  firstName: string;

  @ApiProperty({ example: 'example' })
  lastName: string;

  @ApiProperty({ example: '0123456789' })
  phone: string;

  @ApiProperty({
    example: 'photo.jpg',
  })
  avatar: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
  })
  birthDate: string;

  @ApiProperty({ example: 'null' })
  bio: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
  })
  createdAt: string;
}

export class GetUserFollowersResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      userId: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      username: 'example',
      name: 'example',
      avatar: 'default.png',
    },
  })
  followers: {
    userId: string;
    username: string;
    name: string;
    avatar: string;
  };
}

export class GetUserFollowingsResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      userId: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      username: 'example',
      name: 'example',
      avatar: 'default.png',
    },
  })
  followings: {
    userId: string;
    username: string;
    name: string;
    avatar: string;
  };
}
