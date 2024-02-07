import { Pagination } from 'src/common/decorator/pagination';
import {
  CreateUserDto,
  GetUserFollowersResponseDto,
  GetUserFollowingsResponseDto,
  UpdateUserDto,
  UserDto,
} from '../dto';

export interface IUserService {
  register(user: CreateUserDto): Promise<UserDto>;
  update(userId: string, user: UpdateUserDto): Promise<UserDto>;
  getById(userId: string): Promise<UserDto>;
  getUserFollowings(userId: string, page: Pagination): Promise<GetUserFollowingsResponseDto>;
  getUserFollowers(userId: string, page: Pagination): Promise<GetUserFollowersResponseDto>;
  deactivate(userId: string): Promise<void>;
}
