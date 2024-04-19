import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';

import { CommentDto, CreateCommentPostDto, UpdateCommentPostDto } from './dto';
import { CommentRepository } from './comment.repository';
import { PostRepository } from 'src/post/post.repository';
import { PostComment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async create(userId: string, payload: CreateCommentPostDto): Promise<PostComment> {
    try {
      const isExist = await this.postRepository.isExist(payload.postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      // Create the comment
      const comment = await this.commentRepository.create(userId, payload);
      // Decrease the num of comments on the post
      this.postRepository.incrementComments(payload.postId);

      return comment;
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async get(commentId: string): Promise<CommentDto> {
    try {
      const isExist = await this.commentRepository.isExist(commentId);
      if (!isExist) throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

      const comment = await this.commentRepository.get(commentId);

      return comment;
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async update(commentId: string, payload: UpdateCommentPostDto): Promise<CommentDto> {
    try {
      const isExist = await this.commentRepository.isExist(commentId);
      if (!isExist) throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

      const comment = await this.commentRepository.update(commentId, payload);

      return comment;
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async delete(commentId: string): Promise<void> {
    try {
      const isExist = await this.commentRepository.isExist(commentId);
      if (!isExist) throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

      const postId = (await this.commentRepository.get(commentId)).postId;
      this.postRepository.decrementComments(postId);

      await this.commentRepository.delete(commentId);
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
