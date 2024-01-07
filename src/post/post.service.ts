import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID, randomInt } from 'crypto';
import { Pool } from 'pg';
import slugify from 'slugify';

import { PG_CONNECTION } from 'src/db/db.module';
import { CreatePostDto, CreatePostType, GetPostType, UpdatePostDto, UpdatePostType } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/dto';
import { UserDataDto } from 'src/user/dto/data-user.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(PG_CONNECTION) private readonly db: Pool,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(userData: UserDataDto, payload: CreatePostDto): Promise<CreatePostType> {
    try {
      const postId = randomUUID();
      const slug = generateSlug(userData.username);
      const fields = ['id', 'slug', ...Object.keys(payload)];
      const values = [postId, slug, ...Object.values(payload)];

      const query = `
        INSERT INTO posts (user_id, ${fields.join(', ')})
        VALUES($1, ${values.map((_val, idx) => `$${idx + 2}`)})
        RETURNING *;
      `;

      const post = await this.db.query<CreatePostType>(query, [userData.user_id, ...values]);
      return post.rows[0];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async update(userId: string, postId: string, payload: UpdatePostDto): Promise<UpdatePostType> {
    try {
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

      const post = await this.db.query<UpdatePostType>(query, [postId, userId, ...values]);
      if (post.rows.length === 0) {
        throw new NotFoundException();
      }

      return post.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('post not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async getById(userId: string, postId: string): Promise<GetPostType> {
    try {
      const query = `
        SELECT p.*, COALESCE(pl.likesCount, 0) AS likes_count, COALESCE(pc.commentsCount, 0) AS comments_count
        FROM posts AS p
        LEFT JOIN (
          SELECT post_id, COUNT(post_id) AS likesCount
          FROM post_likes
          GROUP BY post_id
        ) AS pl ON p.id = pl.post_id
        LEFT JOIN (
          SELECT post_id, COUNT(post_id) AS commentsCount
          FROM post_comments
          GROUP BY post_id
        ) AS pc ON p.id = pc.post_id
        WHERE p.id = $1 AND p.user_id = $2;
      `;
      const post = await this.db.query<GetPostType>(query, [postId, userId]);
      if (post.rows.length === 0) {
        throw new NotFoundException();
      }

      return post.rows[0];
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('post not found');
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
      if (post.rowCount === 0) {
        throw new NotFoundException();
      }
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('post not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async uploadMedia(media: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      return await this.cloudinaryService.uploadFile(media);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}

function generateSlug(username: string) {
  const combinedString = `${username}-${randomInt(1e12)}`;
  const slug = slugify(combinedString, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
  });

  return slug;
}
