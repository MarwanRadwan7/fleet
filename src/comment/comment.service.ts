import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';

import { PG_CONNECTION } from 'src/db/db.module';
import {
  CreateCommentPostDto,
  CreateCommentPostType,
  GetCommentPostDto,
  GetCommentPostType,
  UpdateCommentPostDto,
} from './dto';
import { randomUUID } from 'crypto';
import { UpdatePostType } from 'src/post/dto';

@Injectable()
export class CommentService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async create(userId: string, commentBody: CreateCommentPostDto): Promise<CreateCommentPostType> {
    try {
      const query = `
        INSERT INTO post_comments(id, user_id, post_id, content)
        VALUES($1, $2, $3, $4)
        RETURNING id, content ;
      `;
      const values = [randomUUID(), userId, commentBody.postId, commentBody.content];

      const comment = await this.db.query<CreateCommentPostType>(query, values);
      return comment.rows[0];
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user or post not found');
      }
      throw new InternalServerErrorException();
    }
  }
  async get(userId: string, commentBody: GetCommentPostDto): Promise<GetCommentPostType> {
    try {
      const query = `
        SELECT * FROM post_comments
        WHERE user_id = $1 AND id = $2;
      `;
      const values = [userId, commentBody.id];

      const comment = await this.db.query<GetCommentPostType>(query, values);
      if (comment.rows.length === 0) {
        throw new NotFoundException();
      }
      return comment.rows[0];
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user or post not found');
      }
      if (err instanceof NotFoundException) {
        throw new NotFoundException('comment not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(
    userId: string,
    commentId: string,
    commentBody: UpdateCommentPostDto,
  ): Promise<UpdatePostType> {
    try {
      const query = `
        UPDATE post_comments 
        SET content = $3 , updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = $1 AND post_id = $2 AND id = $4
        RETURNING id, content ;
      `;
      const values = [userId, commentBody.postId, commentBody.content, commentId];

      const comment = await this.db.query<UpdatePostType>(query, values);
      if (comment.rows.length === 0) {
        throw new NotFoundException();
      }
      return comment.rows[0];
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user or post not found');
      }
      if (err instanceof NotFoundException) {
        throw new NotFoundException('comment not found');
      }
      throw new InternalServerErrorException();
    }
  }
  async delete(userId: string, commentId: string): Promise<void> {
    try {
      const query = `
        DELETE FROM post_comments
        WHERE user_id = $1 AND id = $2
        RETURNING id
      `;
      const values = [userId, commentId];

      const comment = await this.db.query(query, values);
      if (comment.rowCount === 0) {
        throw new NotFoundException();
      }
    } catch (err) {
      console.error(err);
      if (err.code === '23503') {
        throw new NotFoundException('user or post not found');
      }
      if (err instanceof NotFoundException) {
        throw new NotFoundException('comment not found');
      }
      throw new InternalServerErrorException();
    }
  }
}
