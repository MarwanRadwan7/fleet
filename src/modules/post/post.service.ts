import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { CreatePostDto, UpdatePostDto, PostDto } from './dto';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src//modules/user/user.repository';
import { LikeRepository } from 'src/modules/like/like.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { PageOptionsDto } from 'src/common/dto/pagination';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly commentRepository: CommentRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    userId: string,
    payload: CreatePostDto,
    media?: Express.Multer.File,
  ): Promise<PostDto> {
    try {
      const user = await this.userRepository.isExist(userId);
      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      // Check if the user uploaded a pic on the req.
      if (media) {
        payload.mediaUrl = (await this.cloudinaryService.uploadFile(media)).secure_url;
      }
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

  async getPostLikes(postId: string, pageOptionsDto: PageOptionsDto) {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const likes = await this.likeRepository.getPostLikesData(postId, pageOptionsDto);

      return { count: likes.length, likes: likes };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostComments(postId: string, pageOptionsDto: PageOptionsDto) {
    try {
      const isExist = await this.postRepository.isExist(postId);
      if (!isExist) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

      const comments = await this.commentRepository.getPostCommentsData(postId, pageOptionsDto);

      return { count: comments.length, comments: comments };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByUser(userId: string, pageOptionsDto: PageOptionsDto) {
    try {
      const user = await this.userRepository.isExist(userId);
      if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const posts = await this.postRepository.getAllByUserId(userId, pageOptionsDto);

      return { count: posts.length, posts: posts };
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  async getPostsByHashtags(hashtags: string[], pageOptionsDto: PageOptionsDto): Promise<any> {
    try {
      const hashtagsRegEX = hashtags.map(el => `%${el}%`);

      const posts = await this.postRepository.getPostsByHashtags(hashtagsRegEX, pageOptionsDto);

      return { count: posts.length, posts: posts };
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }
}
