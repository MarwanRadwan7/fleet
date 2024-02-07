import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

import { PostComment } from './comment.entity';
import { CommentDto, CreateCommentPostDto, UpdateCommentPostDto } from './dto';
import { Pagination } from 'src/common/decorator/pagination';
import { ICommentRepository } from './contract';

export class CommentRepository implements ICommentRepository {
  private commentRepository: Repository<PostComment>;

  constructor(@InjectRepository(PostComment) commentRepository: Repository<PostComment>) {
    this.commentRepository = commentRepository;
  }

  async isExist(commentId: string): Promise<boolean> {
    // Check the UUID type
    const isValidUUID = isUUID(commentId);
    if (!isValidUUID) return false;

    // Check the comment
    const comment = await this.commentRepository.exists({
      where: {
        id: commentId,
      },
    });

    if (isValidUUID && comment) return true;

    return false;
  }

  async create(userId: string, payload: CreateCommentPostDto): Promise<PostComment> {
    try {
      payload['userId'] = userId;
      const comment = this.commentRepository.create({
        userId: {
          id: userId,
        },
        postId: { id: payload.postId },
        content: payload.content,
      });
      await this.commentRepository.save(comment);
      return comment;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async get(commentId: string): Promise<CommentDto> {
    try {
      const comment = await this.commentRepository
        .createQueryBuilder()
        .select([
          'id',
          'user_id AS "userId"',
          'post_id AS "postId"',
          'content',
          'is_edited AS "isEdited"',
          'created_at AS "createdAt"',
          'updated_at AS "updatedAt"',
        ])
        .where('id= :commentId', { commentId })
        .execute();

      return comment;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getPostCommentsData(postId: string, page: Pagination): Promise<any> {
    try {
      const likesData = await this.commentRepository
        .createQueryBuilder('c')
        .select([
          'c.id AS "id"',
          'user_id AS "userId"',
          'u.first_name AS "userFirstName"',
          'u.last_name AS "userLastName"',
          'u.avatar AS "userAvatar"',
          'post_id AS "postId"',
          'content AS "content"',
          'is_edited AS "isEdited"',
          'c.created_at AS "createdAt"',
          'c.updated_at AS "updatedAt"',
        ])
        .leftJoin('users', 'u', 'c.user_id = u.id')
        .where('c.post_id= :postId', { postId })
        .limit(page.limit)
        .offset(page.offset)
        .execute();

      return likesData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(commentId: string, payload: UpdateCommentPostDto): Promise<CommentDto> {
    try {
      await this.commentRepository.update(commentId, {
        content: payload.content,
      });
      return await this.get(commentId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(commentId: string): Promise<void> {
    try {
      await this.commentRepository.delete(commentId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
