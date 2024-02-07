import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { Pagination } from 'src/common/decorator/pagination';
import {
  CreatePostDto,
  GetPostCommentsResponseDto,
  GetPostLikesResponseDto,
  UpdatePostDto,
  GetPostsByUserResponseDto,
  PostDto,
} from './dto';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src/user/user.repository';
import { LikeRepository } from 'src/like/like.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { IPostService } from './contract/post.service.interface';

@Injectable()
export class PostService implements IPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(userId: string, payload: CreatePostDto): Promise<PostDto> {
    try {
      const user = await this.userRepository.isExist(userId);
      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const post = await this.postRepository.create(userId, payload);

      return post;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async update(postId: string, payload: UpdatePostDto): Promise<PostDto> {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const post = await this.postRepository.update(postId, payload);

      return post;
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getById(postId: string): Promise<PostDto> {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const post = await this.postRepository.getByPostId(postId);

      return post;
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async delete(postId: string): Promise<void> {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      await this.postRepository.delete(postId);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // TODO: Cache

  async getPostLikes(postId: string, page: Pagination): Promise<GetPostLikesResponseDto> {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const likes = await this.likeRepository.getPostLikesData(postId, page);

      return { count: likes.length, likes: likes };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // TODO: Cache
  async getPostComments(postId: string, page: Pagination): Promise<GetPostCommentsResponseDto> {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const comments = await this.commentRepository.getPostCommentsData(postId, page);

      return { count: comments.length, comments: comments };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByUser(userId: string, page: Pagination): Promise<GetPostsByUserResponseDto> {
    try {
      const user = await this.userRepository.isExist(userId);
      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const posts = await this.postRepository.getAllByUserId(userId, page);

      return { count: posts.length, posts: posts };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByHashtags(hashtags: string[], page: Pagination): Promise<any> {
    try {
      const hashtagsRegEX = hashtags.map(el => `%${el}%`);

      const posts = await this.postRepository.getPostsByHashtags(hashtagsRegEX, page);

      return { count: posts.length, posts: posts };
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }
}
