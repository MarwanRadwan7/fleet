import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';

import { CreateLikePostDto, CreateLikePostResponseDto } from './dto';
import { PostgresError } from 'pg-error-enum';

@Injectable()
export class LikeService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async like(userId: string, payload: CreateLikePostDto): Promise<CreateLikePostResponseDto> {
    const client = await this.db.connect();
    const { post_id: postId } = payload;

    try {
      // Transaction
      await client.query('BEGIN');
      const existingLike = await client.query(
        'SELECT 1 AS liked FROM post_likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId],
      );

      if (existingLike.rows.length > 0) {
        await client.query('DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2', [
          userId,
          postId,
        ]);
        await client.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1;', [
          postId,
        ]);
        await client.query('COMMIT');
        return { liked: false };
      } else {
        await client.query('INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)', [
          userId,
          postId,
        ]);
        await client.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1;', [
          postId,
        ]);
        await client.query('COMMIT');
        return { liked: true };
      }
    } catch (err) {
      console.error(err);

      await client.query('ROLLBACK');
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    } finally {
      client.release();
    }
  }
}
