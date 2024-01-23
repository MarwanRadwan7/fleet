import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { PostgresError } from 'pg-error-enum';

import { PG_CONNECTION } from 'src/db/db.module';
import {
  CreateCommentPostDto,
  CreateCommentPostResponseDto,
  DeleteCommentPostDto,
  GetCommentPostDto,
  GetCommentPostResponseDto,
  UpdateCommentPostDto,
  UpdateCommentPostResponseDto,
} from './dto';

@Injectable()
export class CommentService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async create(
    userId: string,
    payload: CreateCommentPostDto,
  ): Promise<CreateCommentPostResponseDto> {
    // Open a client connection from the pool
    const client = await this.db.connect();
    const { content, post_id: postId} = payload;

    try {
      const query = `
        INSERT INTO post_comments(id, user_id, post_id, content)
        VALUES($1, $2, $3, $4)
        RETURNING id, content ;
      `;
      const values = [randomUUID(), userId, postId, content];

      // Transaction
      await client.query('BEGIN');
      const comment = await client.query<CreateCommentPostResponseDto>(query, values);
      client.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [postId]);
      client.query('COMMIT');

      return comment.rows[0];
    } catch (err) {
      console.error(err);

      client.query('ROLLBACK');
      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    } finally {
      client.release();
    }
  }

  async get(payload: GetCommentPostDto): Promise<GetCommentPostResponseDto> {
    const { user_id: userId, comment_id: commentId } = payload;
    try {
      const query = `
        SELECT * FROM post_comments
        WHERE user_id = $1 AND id = $2;
      `;
      const values = [userId, commentId];

      const comment = await this.db.query<GetCommentPostResponseDto>(query, values);

      if (comment.rows.length === 0)
        throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

      return comment.rows[0];
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async update(payload: UpdateCommentPostDto): Promise<UpdateCommentPostResponseDto> {
    const { post_id: postId, comment_id: commentId, user_id: userId, content } = payload;
    try {
      const query = `
        UPDATE post_comments 
        SET content = $3 , updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $1 AND post_id = $2 AND id = $4
        RETURNING id, content ;
      `;
      const values = [userId, postId, content, commentId];

      const comment = await this.db.query<UpdateCommentPostResponseDto>(query, values);

      if (comment.rows.length === 0)
        throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

      return comment.rows[0];
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async delete(payload: DeleteCommentPostDto): Promise<void> {
    // Open a client connection from the pool
    const client = await this.db.connect();
    const { comment_id: commentId, user_id: userId } = payload;

    try {
      const query = `
        DELETE FROM post_comments
        WHERE user_id = $1 AND id = $2
        RETURNING id , post_id
      `;
      const values = [userId, commentId];

      // Transaction
      await client.query('BEGIN');
      const comment = await client.query(query, values);

      if (comment.rowCount === 0)
        throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

      await client.query('UPDATE posts SET comments_count = comments_count - 1 WHERE id = $1 ', [
        comment.rows[0]['post_id'],
      ]);
      client.query('COMMIT');
    } catch (err) {
      console.error(err);

      client.query('ROLLBACK');

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    } finally {
      client.release();
    }
  }
}
