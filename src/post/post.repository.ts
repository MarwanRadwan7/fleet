import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { IPostRepository } from './contract';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Pagination } from 'src/common/decorator/pagination';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostRepository implements IPostRepository {
  private postRepository: Repository<Post>;

  constructor(@InjectRepository(Post) postRepository: Repository<Post>) {
    this.postRepository = postRepository;
  }

  async isExist(postId: string): Promise<boolean> {
    try {
      // Check the UUID type
      const isValidUUID = isUUID(postId);
      if (!isValidUUID) return false;

      // Check the post
      const user = await this.postRepository.exists({
        where: {
          id: postId,
        },
      });

      if (isValidUUID && user) return true;

      return false;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async create(userId: string, payload: CreatePostDto): Promise<PostDto> {
    const hashtags = payload['content']
      .match(/#(\w+)/g)
      .map((el: string) => `${el.substring(1)}`)
      .join(',');
    try {
      const post = this.postRepository.create({
        userId: { id: userId },
        content: payload.content,
        lng: payload.lng,
        lat: payload.lat,
        mediaUrl: payload.mediaUrl,
        tags: payload.tags,
        hashtags,
      });
      await this.postRepository.save(post);

      return post;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(postId: string, payload: UpdatePostDto): Promise<PostDto> {
    payload['updatedAt'] = new Date().toISOString();
    payload['isEdited'] = true;

    try {
      await this.postRepository.update(postId, payload);
      const post = this.getByPostId(postId);
      return post;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async incrementLikes(postId: string): Promise<void> {
    try {
      await this.postRepository
        .createQueryBuilder('p')
        .update()
        .set({ likesCount: () => 'likesCount + 1' })
        .where('id= :postId', { postId })
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async decrementLikes(postId: string): Promise<void> {
    try {
      await this.postRepository
        .createQueryBuilder('p')
        .update()
        .set({ likesCount: () => 'likesCount - 1' })
        .where('id= :postId', { postId })
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async incrementComments(postId: string): Promise<void> {
    try {
      await this.postRepository
        .createQueryBuilder('p')
        .update()
        .set({ commentsCount: () => 'commentsCount + 1' })
        .where('id= :postId', { postId })
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async decrementComments(postId: string): Promise<void> {
    try {
      await this.postRepository
        .createQueryBuilder('p')
        .update()
        .set({ commentsCount: () => 'commentsCount - 1' })
        .where('id= :postId', { postId })
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getByPostId(postId: string): Promise<PostDto> {
    try {
      return await this.postRepository
        .createQueryBuilder('p')
        .select([
          'p.id AS "id"',
          'p.user_id AS "userId"',
          'p.slug AS "slug"',
          'p.hashtags AS "hashtags"',
          'p.tags AS "tags"',
          'p.content AS "content"',
          'p.media_url AS "mediaUrl"',
          'p.lat AS "Lat"',
          'p.lng AS "Lng"',
          'p.created_at AS "createdAt"',
          'p.updated_at AS "createdAt"',
          'p.likes_count AS "likesCount"',
          'p.comments_count AS "commentsCount"',
        ])
        .where('p.id= :postId', { postId })
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAllByUserId(userId: string, page: Pagination): Promise<PostDto[]> {
    try {
      const posts = await this.postRepository.find({
        where: {
          userId: { id: userId },
        },
        take: page.limit,
        skip: page.offset,
      });

      return posts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getPostsByHashtags(hashtags: string[], page: Pagination): Promise<any> {
    try {
      const posts = this.postRepository.query(
        `
          SELECT id, user_id AS "userId", content, media_url AS "mediaUrl", slug, hashtags, tags, lat, lng, is_edited AS "isEdited", created_at AS "createdAt", updated_at AS "updatedAt",  likes_count AS "likesCount", comments_count AS "commentsACount" 
          FROM posts
          WHERE ${hashtags.map((_tag, index) => `hashtags LIKE $${index + 3}`).join(' OR ')}
          LIMIT $1
          OFFSET $2;
      `,
        [page.limit, page.offset, ...hashtags],
      );

      return posts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getFeedPosts(userId: string, page: Pagination): Promise<any> {
    try {
      return await this.postRepository
        .createQueryBuilder('p')
        .select([
          'u.id as "userId"',
          'u.username AS "username"',
          'u.first_name AS "userFirstName"',
          'u.last_name AS "userLastName"',
          'u.avatar AS "userAvatar"',
          'p.id AS "postId"',
          'p.content AS "postContent"',
          'p.slug AS "postSlug"',
          'p.tags AS "postTags"',
          'p.hashtags AS "postHashtags"',
          'p.media_url AS "postMediaUrl"',
          'p.created_at AS "postCreatedAt"',
          'p.lat AS "postLat"',
          'p.lng AS "postLng"',
          'p.likes_count AS "postLikesCount"',
          'p.comments_count AS "postCommentsCount"',
        ])
        .innerJoin('followings', 'f', 'p.user_id = f.following_id')
        .innerJoin('users', 'u', 'f.following_id = u.id')
        .where('f.user_id= :userId', { userId })
        .orderBy('p.created_at', 'DESC')
        .limit(page.limit)
        .offset(page.offset)
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getTopFeedPosts(): Promise<any> {
    try {
      return await this.postRepository
        .createQueryBuilder('p')
        .select([
          'u.id as "userId"',
          'u.username AS "username"',
          'u.first_name AS "userFirstName"',
          'u.last_name AS "userLastName"',
          'u.avatar AS "userAvatar"',
          'p.id AS "postId"',
          'p.content AS "postContent"',
          'p.slug AS "postSlug"',
          'p.media_url AS "postMediaUrl"',
          'p.created_at AS "postCreatedAt"',
          'p.lat AS "postLat"',
          'p.lng AS "postLng"',
          'p.likes_count AS "postLikesCount"',
          'p.comments_count AS "postCommentsCount"',
          'likes_count + comments_count AS "totalInteractions"',
        ])
        .innerJoin('users', 'u', 'p.user_id = u.id')
        .orderBy('"totalInteractions"', 'DESC')
        .limit(30)
        .execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(postId: string): Promise<void> {
    try {
      const post = await this.getByPostId(postId);
      await this.postRepository.remove(post);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
