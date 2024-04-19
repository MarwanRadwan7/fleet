import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserRepository } from 'src/user/user.repository';
import { PostRepository } from 'src//modules/post/post.repository';
import { PostDto } from 'src/modules/post/dto';
import { PageOptionsDto } from 'src/common/dto/pagination';

@Injectable()
export class FeedService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async feed(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<{ count: number; posts: PostDto[] }> {
    try {
      const isExist = await this.userRepository.isExist(userId);
      if (!isExist) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

      const posts = await this.postRepository.getFeedPosts(userId, pageOptionsDto);

      return { count: posts.length, posts: posts };
    } catch (err) {
      console.error(err);

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  // topFeed gets the top 30 posts on the platform based on the interactions with the posts
  async topFeed(): Promise<PostDto[]> {
    try {
      const posts = await this.postRepository.getTopFeedPosts();

      return posts;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
