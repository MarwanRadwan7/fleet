import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';

import { CreateLikePostDto, CreateLikePostType } from './dto';

@Injectable()
export class LikeService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async like(userId: string, likePostBody: CreateLikePostDto): Promise<CreateLikePostType> {
    try {
      const postId = likePostBody.postId;
      const existingLike = await this.db.query(
        'SELECT 1 AS liked FROM post_likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId],
      );

      if (existingLike.rows.length > 0) {
        await this.db.query('DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2', [
          userId,
          postId,
        ]);
        return { liked: false };
      } else {
        await this.db.query('INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)', [
          userId,
          postId,
        ]);
        return { liked: true };
      }
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user or post not found');
      }
      throw new InternalServerErrorException();
    }
  }
}
