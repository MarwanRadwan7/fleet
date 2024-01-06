import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import slugify from 'slugify';

import { PG_CONNECTION } from 'src/db/db.module';
import { CreatePostDto, GetPostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async create(userId: string, username: string, payload: CreatePostDto) {
    try {
      const postId = randomUUID();
      const slug = generateSlug(username, postId);
      const fields = ['id', 'slug', ...Object.keys(payload)];
      const values = [postId, slug, ...Object.values(payload)];

      const query = `
        INSERT INTO posts (user_id, ${fields.map(field => `${field} `).join(',')})
        VALUES($1, ${values.map((_val, idx) => `$${idx + 2}`)})
        RETURNING *;
      `;

      const post = await this.db.query(query, [userId, ...values]);
      return post.rows[0];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async update(userId: string, postId: string, payload: UpdatePostDto) {
    try {
      const fields = [...Object.keys(payload)];
      const values = [...Object.values(payload)];

      const query = `
        UPDATE posts
        SET ${fields.map((field, index) => `${field} = $${index + 3}`).join(', ')}
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;

      const post = await this.db.query(query, [postId, userId, ...values]);
      if (post.rows.length === 0) {
        throw new NotFoundException();
      }

      return post.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new HttpException('post not found', HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException();
    }
  }

  async getById(userId: string, postId: string): Promise<GetPostDto> {
    try {
      const query = `
        SELECT * FROM posts 
        WHERE id = $1 AND user_id = $2 ;
      `;
      const post = await this.db.query(query, [postId, userId]);
      if (post.rows.length === 0) {
        throw new NotFoundException();
      }

      return post.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new HttpException('post not found', HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const query = `
        DELETE FROM posts
        WHERE id = $1;
      `;
      const post = await this.db.query(query, [id]);
      if (post.rows.length === 0) {
        throw new NotFoundException();
      }

      return;
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new HttpException('post not found', HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException();
    }
  }
}

function generateSlug(username, postId) {
  const combinedString = `${username}-${postId}`;
  const slug = slugify(combinedString, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
  });

  return slug;
}
