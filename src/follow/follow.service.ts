import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

import { PG_CONNECTION } from 'src/db/db.module';
import { BlockService } from 'src/block/block.service';
import { CreateFollowDto, DeleteFollowDto } from './dto';
import { PostgresError } from 'pg-error-enum';

@Injectable()
export class FollowService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: Pool,
    private readonly blockService: BlockService,
  ) {}

  async follow(userId: string, followBody: CreateFollowDto): Promise<void> {
    // create a client from the pool to implement a transaction
    const client = await this.db.connect();

    try {
      const friendId = followBody.friendId;

      // Check if the user and  the follower are the same
      if (userId === friendId)
        throw new HttpException('you cannot follow yourself', HttpStatus.BAD_REQUEST);

      // Check for blocking
      const isBlocked = await this.blockService.isBlocked(userId, friendId);
      if (isBlocked)
        throw new HttpException(
          'you are blocked. you cannot follow this user',
          HttpStatus.CONFLICT,
        );

      // Begin Transaction
      await client.query('BEGIN');
      await client.query(
        `
        INSERT INTO 
        followings (id , user_id, following_id)
        VALUES($1, $2, $3);
      `,
        [randomUUID(), userId, friendId],
      );
      await client.query(
        `
        INSERT INTO 
        followers (id , user_id, follower_id)
        VALUES($1, $3, $2);
      `,
        [randomUUID(), userId, friendId],
      );

      await client.query('COMMIT');
    } catch (err) {
      console.error(err);

      // Rollback if error in the db
      await client.query('ROLLBACK');

      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException('user is already followed', HttpStatus.CONFLICT);
      throw new InternalServerErrorException();
    } finally {
      client.release();
    }
  }

  async unFollow(payload: DeleteFollowDto): Promise<void> {
    // create a client from the pool to implement a transaction
    const client = await this.db.connect();

    const userId = payload.user_id;
    const friendId = payload.following_id;
    try {
      // Check if the user and  the follower are the same
      if (userId === friendId)
        throw new HttpException('you cannot unfollow yourself', HttpStatus.BAD_REQUEST);

      // Begin Transaction
      await client.query('BEGIN');
      await client.query(
        `
        DELETE FROM followings
        WHERE user_id = $1 AND following_id = $2;
      `,
        [userId, friendId],
      );
      await client.query(
        `
        DELETE FROM followers
        WHERE user_id = $2 AND follower_id = $1;
      `,
        [userId, friendId],
      );

      await client.query('COMMIT');
    } catch (err) {
      console.error(err);

      // Rollback if error in the db
      await client.query('ROLLBACK');

      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      throw new InternalServerErrorException();
    } finally {
      client.release();
    }
  }
}
