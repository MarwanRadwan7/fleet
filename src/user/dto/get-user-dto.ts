import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user.interface';
import { ApiProperty } from '@nestjs/swagger';

// Request Types - Fields Validation
export class GetUserDataDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

// Response Types
export type GetUserFollowersResponseDto = { count: number } & {
  followers: Pick<User, 'id' | 'username' | 'name' | 'avatar'>[];
};

export type GetUserFollowingsResponseDto = { count: number } & {
  followings: Pick<User, 'id' | 'username' | 'name' | 'avatar'>[];
};

export type GetUserLikesResponseDto = Pick<User, 'id' | 'username' | 'name' | 'avatar'>;

export type GetUserCommentsResponseDto = Pick<User, 'id' | 'username' | 'name' | 'avatar'>;

export type GetUserResponseDto = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'phone' | 'birthDate' | 'avatar' | 'bio'
>;
export type GetUserByUsernameResponseDto = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'password' | 'isActive'
>;

export class GetUserResponseDtoExample {
  @ApiProperty({ example: '01ac844b-1c1d-4676-abe1-efa90b0428e0' })
  id: string;

  @ApiProperty({ example: 'example' })
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  phone: string;

  @ApiProperty({
    example: 'photo.jpg',
  })
  avatar: string;

  @ApiProperty({
    example: '2024-01-01T12:30:45Z',
  })
  birth_date: string;

  @ApiProperty({ example: 'example' })
  bio: string;
}

export class GetUserFollowersResponseDtoExample {
  @ApiProperty({
    example: 1,
  })
  count: number;

  @ApiProperty({
    example: {
      user_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      username: 'example',
      name: 'example',
      avatar: 'default.png',
    },
  })
  followers: {
    user_id: string;
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
      user_id: '6fcb4875-c4dc-4c8f-b15f-06f9fd8c18e8',
      username: 'example',
      name: 'example',
      avatar: 'default.png',
    },
  })
  followings: {
    user_id: string;
    username: string;
    name: string;
    avatar: string;
  };
}
