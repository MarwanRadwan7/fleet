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

@Injectable()
export class PostService {
  constructor(@Inject(PG_CONNECTION) private readonly db: Pool) {}

  /**
   * Creates a new post in the database.
   * @param userId - The ID of the user creating the post.
   * @param username - The username of the user creating the post.
   * @param payload - The data for the new post.
   * @returns The created post.
   * @throws InternalServerErrorException if an error occurs during the creation process.
   */
  async create(userId: string, username: string, payload: CreatePostDto): Promise<CreatePostType> {
    try {
      const postId = randomUUID();
      const slug = generateSlug(username);
      const fields = ['id', 'slug', ...Object.keys(payload)];
      const values = [postId, slug, ...Object.values(payload)];

      const query = `
        INSERT INTO posts (user_id, ${fields.join(', ')})
        VALUES($1, ${values.map((_val, idx) => `$${idx + 2}`)})
        RETURNING *;
      `;

      const post = await this.db.query<CreatePostType>(query, [userId, ...values]);
      return post.rows[0];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Updates an existing post in the database.
   * @param userId - The ID of the user updating the post.
   * @param postId - The ID of the post to update.
   * @param payload - The data to update the post with.
   * @returns The updated post.
   * @throws NotFoundException if the post is not found.
   * @throws InternalServerErrorException if an error occurs during the update process.
   */
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

  /**
   * Retrieves a post from the database by its ID and user ID.
   * @param userId - The ID of the user retrieving the post.
   * @param postId - The ID of the post to retrieve.
   * @returns The retrieved post.
   * @throws NotFoundException if the post is not found.
   * @throws InternalServerErrorException if an error occurs during the retrieval process.
   */
  async getById(userId: string, postId: string): Promise<GetPostType> {
    try {
      const query = `
        SELECT * FROM posts 
        WHERE id = $1 AND user_id = $2 ;
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

  /**
   * Deletes a post from the database by its ID.
   * @param id - The ID of the post to delete.
   * @throws NotFoundException if the post is not found.
   * @throws InternalServerErrorException if an error occurs during the deletion process.
   */
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
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw new NotFoundException('post not found');
      }
      throw new InternalServerErrorException();
    }
  }
}

function generateSlug(username) {
  const combinedString = `${username}-${randomInt(1e12)}`;
  const slug = slugify(combinedString, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
  });

  return slug;
}
