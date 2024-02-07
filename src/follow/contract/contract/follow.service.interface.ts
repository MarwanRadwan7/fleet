import { CreateFollowDto, DeleteFollowDto } from 'src/follow/dto';

export interface IFollowService {
  follow(userId: string, payload: CreateFollowDto): Promise<void>;
  unFollow(userId: string, payload: DeleteFollowDto): Promise<void>;
}
