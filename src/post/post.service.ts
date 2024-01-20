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
import { UserService } from 'src/user/user.service';
import { Pagination } from 'src/common/decorator/pagination';
import {
  CreatePostDto,
  CreatePostResponseDto,
  GetPostDataDto,
  GetPostCommentsResponseDto,
  GetPostLikesResponseDto,
  GetPostResponseDto,
  GetPostsByUserDto,
  UpdatePostDto,
  UpdatePostResponseDto,
  GetPostsByHashtagsResponseDto,
  GetPostsByUserResponseDto,
} from './dto';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    @Inject(PG_CONNECTION) private readonly db: Pool,
  ) {}

  async isExist(postId: string): Promise<boolean> {
    try {
      const query = `
        SELECT id
        FROM posts 
        WHERE posts.id = $1
      `;

      const post = await this.db.query(query, [postId]);

      if (post.rowCount === 0) return false;

      return true;
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }

  async create(userData: UserDataDto, payload: CreatePostDto): Promise<CreatePostResponseDto> {
    try {
      const user = await this.userService.isExist(userData.user_id);
      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

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

  async update(
    postId: string,
    userId: string,
    payload: UpdatePostDto,
  ): Promise<UpdatePostResponseDto> {
    try {
      // FIXME:
      const isExist = await this.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      payload['updated_at'] = new Date().toISOString();
      payload['edited'] = true;

      const fields = Object.keys(payload);
      const values = Object.values(payload);

      const query = `
        UPDATE posts
        SET ${fields.map((field, index) => `${field} = $${index + 3}`).join(', ')}
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;

      const post = await this.db.query<UpdatePostResponseDto>(query, [postId, userId, ...values]);

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

      if (post.rowCount === 0) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      return post.rows[0];
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async delete(postId: string): Promise<void> {
    try {
      const isExist = await this.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const query = `
        DELETE FROM posts
        WHERE id = $1;
      `;

      await this.db.query(query, [postId]);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // TODO: Cache

  async getPostLikes(payload: GetPostDataDto, page: Pagination): Promise<GetPostLikesResponseDto> {
    try {
      const isExist = await this.isExist(payload.post_id);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const query = `
        SELECT u.id AS user_id, u.username, u.name, u.avatar
        FROM post_likes AS l
        JOIN users AS u
        ON u.id = l.user_id
        WHERE l.post_id = $1
        LIMIT $2
        OFFSET $3;
      `;
      const likes = await this.db.query(query, [payload.post_id, page.limit, page.offset]);

      return { count: likes.rowCount, likes: likes.rows };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // TODO: Cache
  async getPostComments(
    payload: GetPostDataDto,
    page: Pagination,
  ): Promise<GetPostCommentsResponseDto> {
    try {
      const isExist = await this.isExist(payload.post_id);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const query = `
        SELECT u.id AS user_id, u.username AS comment_id, u.name, u.avatar, c.content, c.created_at, c.updated_at
        FROM post_comments AS c
        JOIN users AS u
        ON u.id = c.user_id
        WHERE c.post_id = $1
        LIMIT $2
        OFFSET $3;
      `;

      const comments = await this.db.query(query, [payload.post_id, page.limit, page.offset]);

      return { count: comments.rowCount, comments: comments.rows };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByUser(
    payload: GetPostsByUserDto,
    page: Pagination,
  ): Promise<GetPostsByUserResponseDto> {
    try {
      const user = await this.userService.isExist(payload.user_id);
      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const query = `
      SELECT p.id, p.slug, p.content, p.media_url, p.hashtags, p.lat, p.lng, p.edited, p.created_at
      FROM posts AS p
      WHERE p.user_id = $1
      LIMIT $2
      OFFSET $3;
    `;
      const posts = await this.db.query(query, [payload.user_id, page.limit, page.offset]);

      return { count: posts.rowCount, posts: posts.rows };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByHashtags(
    hashtags: string[],
    page: Pagination,
  ): Promise<GetPostsByHashtagsResponseDto> {
    try {
      const hashtagsRegEX = hashtags.map(el => `%${el}%`);

      const query = `
        SELECT *
        FROM posts
        WHERE ${hashtagsRegEX.map((_tag, index) => `hashtags LIKE $${index + 3}`).join(' OR ')}
        LIMIT $1
        OFFSET $2;
      `;

      const posts = await this.db.query(query, [page.limit, page.offset, ...hashtagsRegEX]);

      return { count: posts.rowCount, posts: posts.rows };
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }
}
