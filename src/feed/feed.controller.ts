import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FeedService } from './feed.service';
import { JwtGuard } from 'src/auth/guard';
import { PostService } from 'src/post/post.service';
import { GetFeedResponseDto, GetTopFeedResponseDto } from './dto';
import { GetPostsByHashtagsResponseDto } from 'src/post/dto';
import { Pagination, PaginationParams } from 'src/common/decorator/pagination';

@Controller('feed')
@ApiTags('Feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly postService: PostService,
  ) {}

  @Get('/')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets the feed of the logged in user' })
  @ApiOkResponse({ description: 'feed retrieved successfully', type: GetFeedResponseDto })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async feed(@PaginationParams() paginationParams: Pagination, @Req() req) {
    const userId = req.user.id;
    const posts: GetFeedResponseDto = await this.feedService.feed(userId, paginationParams);
    return { statusCode: 200, message: 'feed retrieved successfully', data: { ...posts } };
  }

  @Get('/top')
  @ApiOperation({ summary: 'Gets top 30 posts on the platform based on interactions' })
  @ApiOkResponse({ description: 'feed retrieved successfully', type: GetTopFeedResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async top() {
    const posts: GetTopFeedResponseDto[] = await this.feedService.topFeed();
    return { statusCode: 200, message: 'feed retrieved successfully', data: { posts } };
  }

  @Get('/hashtags')
  @ApiOperation({ summary: 'Gets posts related to hashtags' })
  @ApiOkResponse({
    description: 'feed retrieved successfully',
    type: GetPostsByHashtagsResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiQuery({ name: 'hashtags', example: '?hashtags=webdev&hashtags=programming&hashtags=life' })
  async postsByHashtags(
    @PaginationParams() paginationParams: Pagination,
    @Query() hashtags: { hashtags: string[] },
  ) {
    let posts: GetPostsByHashtagsResponseDto;
    if (Array.isArray(hashtags.hashtags)) {
      posts = await this.postService.getPostsByHashtags(hashtags.hashtags, paginationParams);
    } else {
      const hashes = Array(hashtags.hashtags);
      posts = await this.postService.getPostsByHashtags(hashes, paginationParams);
    }
    return { statusCode: 200, message: 'feed retrieved successfully', data: { ...posts } };
  }
}
