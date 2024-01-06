import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

import { PG_CONNECTION } from 'src/db/db.module';
import { BlockService } from 'src/block/block.service';
import { CreateFollowDto } from './dto';

@Injectable()
export class FollowService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: Pool,
    private readonly blockService: BlockService,
  ) {}

  async follow(userId: string, followBody: CreateFollowDto): Promise<void> {
    try {
      const friendId = followBody.friendId;
      if (userId === friendId) {
        throw new ForbiddenException('you cannot follow yourself');
      }

      // Check for blocking
      const isBlocked = await this.blockService.isBlocked(userId, friendId);
      if (isBlocked) {
        throw new ForbiddenException('you cannot follow this user');
      }

      const query = `
      INSERT INTO 
      follows (id , user_id, friend_id)
      VALUES($1, $2, $3)
    `;

      await this.db.query(query, [randomUUID(), userId, friendId]);
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user not found');
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException();
    }
  }
  async unFollow(userId: string, friendId: string): Promise<void> {
    try {
      if (userId === friendId) {
        throw new ForbiddenException();
      }

      const query = `
      DELETE FROM follows
      WHERE user_id = $1 AND friend_id = $2;
    `;

      await this.db.query(query, [userId, friendId]);
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user not found');
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException('you cannot unfollow yourself');
      }
      throw new InternalServerErrorException();
    }
  }
}
