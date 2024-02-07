import { Pagination } from 'src/common/decorator/pagination';
import { FollowsUserDataDto } from 'src/follow/dto';

export interface IFollowRepository {
  isFollowed(userId: string, friendId: string): Promise<boolean>;
  createFollow(userId: string, friendId: string): Promise<void>;
  deleteFollow(userId: string, friendId: string): Promise<void>;
  getUserFollowings(userId: string, page: Pagination): Promise<FollowsUserDataDto[]>;
  getUserFollowers(userId: string, page: Pagination): Promise<FollowsUserDataDto[]>;
}
