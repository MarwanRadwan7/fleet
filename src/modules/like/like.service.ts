import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';

import { CreateLikePostDto, CreateLikePostResponseDto } from './dto';
import { LikeRepository } from './like.repository';
import { PostRepository } from 'src//modules/post/post.repository';

@Injectable()
export class LikeService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly likeRepository: LikeRepository,
  ) {}

  async like(userId: string, payload: CreateLikePostDto): Promise<CreateLikePostResponseDto> {
    const { postId } = payload;
    try {
      const isLiked = await this.likeRepository.isLiked(userId, postId);

      if (isLiked) {
        await this.likeRepository.removeLike(userId, postId);
        this.postRepository.decrementLikes(postId);
        return { liked: false };
      } else {
        await this.likeRepository.createLike(userId, postId);
        this.postRepository.incrementLikes(postId);
        return { liked: true };
      }
    } catch (err) {
      console.error(err);

      if (err.code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new HttpException('user or post not found', HttpStatus.NOT_FOUND);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }
}
