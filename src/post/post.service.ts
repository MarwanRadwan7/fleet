import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { Pool } from 'pg';

import { PG_CONNECTION } from 'src/db/db.module';
import { UserDataDto } from 'src/user/dto/data-user.dto';
import {
  CreatePostDto,
  CreatePostResponseDto,
  GetPostDataDto,
  GetPostCommentsResponseDto,
  GetPostLikesResponseDto,
  GetPostResponseDto,
  GetPostsByUserDto,
  GetPostsByUserResponseDto,
  UpdatePostDto,
  UpdatePostResponseDto,
  GetPostsByHashtagsResponseDto,
} from './dto';

@Injectable()
export class PostService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  async create(userData: UserDataDto, payload: CreatePostDto): Promise<CreatePostResponseDto> {
    try {
      const postId = randomUUID();
      const slug = randomInt(1e12);
      const hashtags = payload['content']
        .match(/#(\w+)/g)
        .map((el: string) => `${el.substring(1)}`)
        .join(',');

      const fields = ['user_id', 'id', 'slug', 'hashtags', ...Object.keys(payload)];
      const values = [userData.user_id, postId, slug, hashtags, ...Object.values(payload)];

      const query = `
        INSERT INTO posts (${fields.join(', ')})
        VALUES(${values.map((_val, idx) => `$${idx + 1}`)})
        RETURNING *;
      `;

      const post = await this.db.query<CreatePostResponseDto>(query, values);

      return post.rows[0];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async update(payload: UpdatePostDto): Promise<UpdatePostResponseDto> {
    const { post_id: postId, user_id: userId } = payload;

    try {
      delete payload.post_id;
      delete payload.user_id;

      payload['updated_at'] = new Date().toISOString();
      payload['edited'] = true;

      const fields = Object.keys(payload);
      const values = [postId, userId, ...Object.values(payload)];

      const query = `
        UPDATE posts
        SET ${fields.map((field, index) => `${field} = $${index + 3}`).join(', ')}
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;

      const post = await this.db.query<UpdatePostResponseDto>(query, values);

      if (post.rows.length === 0) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      return post.rows[0];
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getById(postId: string): Promise<GetPostResponseDto> {
    try {
      const query = `
        SELECT * 
        FROM posts 
        WHERE posts.id = $1
      `;

      const post = await this.db.query<GetPostResponseDto>(query, [postId]);

      if (post.rows.length === 0) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      return post.rows[0];
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async delete(postId: string): Promise<void> {
    try {
      const query = `
        DELETE FROM posts
        WHERE id = $1;
      `;

      const post = await this.db.query(query, [postId]);

      if (post.rowCount === 0) throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostLikes(payload: GetPostDataDto): Promise<GetPostLikesResponseDto[]> {
    try {
      const query = `
      SELECT u.id AS user_id, u.username, u.name, u.avatar
      FROM post_likes AS l
      JOIN users AS u
      ON u.id = l.user_id
      WHERE l.post_id = $1;
    `;
      const post = await this.db.query<GetPostLikesResponseDto>(query, [payload.post_id]);

      if (post.rows.length === 0) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      return post.rows;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostComment(payload: GetPostDataDto): Promise<GetPostCommentsResponseDto[]> {
    try {
      const query = `
      SELECT u.id AS user_id, u.username AS comment_id, u.name, u.avatar, c.content, c.created_at, c.updated_at
      FROM post_comments AS c
      JOIN users AS u
      ON u.id = c.user_id
      WHERE c.post_id = $1;
    `;

      const post = await this.db.query<GetPostCommentsResponseDto>(query, [payload.post_id]);

      if (post.rows.length === 0) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      return post.rows;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostByUser(payload: GetPostsByUserDto): Promise<GetPostsByUserResponseDto[]> {
    try {
      const query = `
      SELECT p.id, p.slug, p.content, p.media_url, p.hashtags, p.lat, p.lng, p.edited, p.created_at
      FROM posts AS p
      WHERE p.user_id = $1 ;
    `;
      const post = await this.db.query<GetPostsByUserResponseDto>(query, [payload.user_id]);

      if (post.rows.length === 0) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      return post.rows;
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByHashtags(hashtags: string[]): Promise<GetPostsByHashtagsResponseDto[]> {
    try {
      const hashtagsRegEX = hashtags.map(el => `%${el}%`);

      const query = `
        SELECT *
        FROM posts
        WHERE ${hashtagsRegEX.map((_tag, index) => `hashtags LIKE $${index + 1}`).join(' OR ')}
      `;

      const posts = await this.db.query<GetPostsByHashtagsResponseDto>(query, hashtagsRegEX);

      return posts.rows;
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }
}
