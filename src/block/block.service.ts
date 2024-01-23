import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { PostgresError } from 'pg-error-enum';

import { PG_CONNECTION } from 'src/db/db.module';
import { CreateBlockDto } from './dto';

@Injectable()
export class BlockService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async isBlocked(userId: string, friendId: string): Promise<boolean> {
    const query = `
        SELECT EXISTS (
          SELECT 1 FROM blocks
          WHERE 
          (user_id = $1 AND friend_id = $2)
          OR
          (user_id = $2 AND friend_id = $1)
        )
      `;

    const result = await this.db.query(query, [userId, friendId]);
    return result.rows[0].exists;
  }

  async block(userId: string, payload: CreateBlockDto): Promise<void> {
    try {
      const friendId = payload.blocked_id;

      if (userId === friendId)
        throw new HttpException('you cannot block yourself', HttpStatus.BAD_REQUEST);

      const existingFollow = await this.db.query(
        'SELECT id FROM follows WHERE user_id = $1 AND friend_id = $2',
        [userId, friendId],
      );

      if (existingFollow.rows.length > 0) {
        await this.db.query(
          'DELETE FROM follows WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $3 AND friend_id = $4)',
          [userId, friendId, friendId, userId],
        );
      }

      await this.db.query('INSERT INTO blocks (id, user_id, friend_id) VALUES ($1, $2, $3)', [
        randomUUID(),
        userId,
        friendId,
      ]);
    } catch (err) {
      console.error(err);

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

      const query = `
        DELETE FROM blocks
        WHERE user_id = $1 AND friend_id = $2;
      `;

      await this.db.query(query, [userId, friendId]);
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new NotFoundException('user not found');
      throw new InternalServerErrorException();
    }
  }
}
