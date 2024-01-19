import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user.interface';

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
