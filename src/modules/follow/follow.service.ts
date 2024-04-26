import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';

import { CreateFollowDto, DeleteFollowDto } from './dto';
import { FollowRepository } from './follow.repository';
import { BlockRepository } from 'src/modules/block/block.repository';

@Injectable()
export class FollowService {
  private readonly logger = new Logger(FollowService.name);
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly blockRepository: BlockRepository,
  ) {}

  async follow(userId: string, payload: CreateFollowDto): Promise<void> {
    try {
      const followingId = payload.followingId;

      // Check if the user and  the follower are the same
      if (userId === followingId)
        throw new HttpException('you cannot follow yourself', HttpStatus.BAD_REQUEST);

      // Check if followed before
      const isFollowed = await this.followRepository.isFollowed(userId, followingId);
      if (isFollowed) throw new HttpException('user is already followed', HttpStatus.CONFLICT);

      // Check for blocking
      const isBlocked = await this.blockRepository.isBlocked(userId, followingId);
      if (isBlocked)
        throw new HttpException(
          'you are blocked. you cannot follow this user',
          HttpStatus.CONFLICT,
        );

      // Make follow
      await this.followRepository.createFollow(userId, followingId);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException('user is already followed', HttpStatus.CONFLICT);
      throw new InternalServerErrorException();
    }
  }

  async unFollow(userId: string, payload: DeleteFollowDto): Promise<void> {
    const followingId = payload.followingId;
    try {
      // Check if the user and  the follower are the same
      if (userId === followingId)
        throw new HttpException('you cannot unfollow yourself', HttpStatus.BAD_REQUEST);

      // delete the follow
      await this.followRepository.deleteFollow(userId, followingId);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      throw new InternalServerErrorException();
    }
  }
}
