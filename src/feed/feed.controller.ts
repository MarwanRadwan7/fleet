import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';

import { FeedService } from './feed.service';
import { JwtGuard } from 'src/auth/guard';
import { PostService } from 'src/post/post.service';
import { GetFeedResponseDto, GetTopFeedResponseDto } from './dto';
import { GetPostsByHashtagsResponseDto } from 'src/post/dto';

@Controller('feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly postService: PostService,
  ) {}

  @Get('/')
  @UseGuards(JwtGuard)
  async feed(@Req() req) {
    const userId = req.user.id;
    const posts: GetFeedResponseDto[] = await this.feedService.feed(userId);
    return { statusCode: 200, message: 'feed retrieved successfully', data: { posts } };
  }

  @Get('/top')
  async top() {
    const posts: GetTopFeedResponseDto[] = await this.feedService.topFeed();
    return { statusCode: 200, message: 'feed retrieved successfully', data: { posts } };
  }

  @Get('/hashtags')
  async postsByHashtags(@Query() hashtags: { hashtags: string[] }) {
    let posts: GetPostsByHashtagsResponseDto[];
    if (Array.isArray(hashtags.hashtags)) {
      posts = await this.postService.getPostsByHashtags(hashtags.hashtags);
    } else {
      const hashes = Array(hashtags.hashtags);
      posts = await this.postService.getPostsByHashtags(hashes);
    }
    return { statusCode: 200, message: 'feed retrieved successfully', data: { posts } };
  }
}
