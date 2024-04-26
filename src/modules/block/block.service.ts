import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';

import { CreateBlockDto } from './dto';
import { BlockRepository } from './block.repository';
import { FollowRepository } from 'src/modules/follow/follow.repository';

@Injectable()
export class BlockService {
  private readonly logger = new Logger(BlockService.name);

  constructor(
    private readonly followRepository: FollowRepository,
    private readonly blockRepository: BlockRepository,
  ) {}

  async block(userId: string, payload: CreateBlockDto): Promise<void> {
    try {
      const friendId = payload.blockedId;
      if (userId === friendId)
        throw new HttpException('you cannot block yourself', HttpStatus.BAD_REQUEST);

      // Check for previous block
      const isBlocked = await this.blockRepository.isBlocked(userId, friendId);
      if (isBlocked) throw new HttpException('user is already blocked', HttpStatus.CONFLICT);

      // check for  previous follow and delete it
      const existingFollow = await this.followRepository.isFollowed(userId, friendId);
      if (existingFollow) {
        await this.followRepository.deleteFollow(userId, friendId);
      }

      // create the block
      await this.blockRepository.createBlock(userId, friendId);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException('user is already blocked', HttpStatus.CONFLICT);
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      throw new InternalServerErrorException();
    }
  }

  async unBlock(userId: string, friendId: string): Promise<void> {
    try {
      if (userId === friendId)
        throw new HttpException('you cannot unblock yourself', HttpStatus.BAD_REQUEST);

      await this.blockRepository.removeBlock(userId, friendId);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new NotFoundException('user not found');
      throw new InternalServerErrorException();
    }
  }
}
