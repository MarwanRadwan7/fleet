import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { ParsePipe, SharpTransformPipe } from 'src/common/pipe';
import {
  CreatePostDto,
  CreatePostResponseDtoExample,
  GetPostCommentsResponseDto,
  GetPostLikesResponseDto,
  GetPostLikesResponseDtoExample,
  GetPostResponseDtoExample,
  UpdatePostDto,
  UpdatePostResponseDtoExample,
  PostDto,
  GetPostCommentsResponseDtoExample,
} from './dto';
import { PageOptionsDto } from 'src/common/dto/pagination';

@Controller('posts')
@UseInterceptors(CacheInterceptor)
@ApiTags('Posts')
@UseGuards(ThrottlerGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('media'))
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Creates a new post' })
  @ApiCreatedResponse({
    description: 'post created successfully',
    type: CreatePostResponseDtoExample,
  })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: CreatePostDto,
  })
  async create(
    @Req() req,
    @UploadedFile(ParsePipe, SharpTransformPipe)
    media: Express.Multer.File,
    @Body()
    payload: CreatePostDto,
  ) {
    const post = await this.postService.create(req.user.userID, payload, media);
    return { statusCode: HttpStatus.CREATED, message: 'post created successfully', data: { post } };
  }

  @Patch('/:post_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Updates an existing post' })
  @ApiOkResponse({ description: 'post updated successfully', type: UpdatePostResponseDtoExample })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: UpdatePostDto,
  })
  async update(@Req() req, @Param('post_id') postId: string, @Body() postBody: UpdatePostDto) {
    const payload: UpdatePostDto = { ...postBody };
    const post = await this.postService.update(postId, payload);

    return { statusCode: HttpStatus.OK, message: 'post updated successfully', data: { post } };
  }

  @Get('/:post_id')
  @CacheTTL(30_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets an existing post' })
  @ApiOkResponse({ description: 'post retrieved successfully', type: GetPostResponseDtoExample })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getById(@Req() req, @Param('post_id') postId: string) {
    const post: PostDto = await this.postService.getById(postId);
    return { statusCode: HttpStatus.OK, message: 'post retrieved successfully', data: { post } };
  }

  @Get('/:post_id/likes')
  @CacheTTL(30_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets likes info on an existing post' })
  @ApiOkResponse({
    description: 'likes retrieved successfully',
    type: GetPostLikesResponseDtoExample,
  })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPostLikes(@Query() pageOptionsDto: PageOptionsDto, @Param('post_id') postId: string) {
    const likes: GetPostLikesResponseDto = await this.postService.getPostLikes(
      postId,
      pageOptionsDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'likes retrieved successfully',
      data: { ...likes },
    };
  }

  @Get('/:post_id/comments')
  @CacheTTL(30_000)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets comments info on an existing post' })
  @ApiOkResponse({
    description: 'comments retrieved successfully',
    type: GetPostCommentsResponseDtoExample,
  })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getPostComments(@Query() pageOptionsDto: PageOptionsDto, @Param('post_id') postId: string) {
    const comments: GetPostCommentsResponseDto = await this.postService.getPostComments(
      postId,
      pageOptionsDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'comments retrieved successfully',
      data: { ...comments },
    };
  }

  @Delete('/:post_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Deletes an existing post' })
  @ApiNoContentResponse({ description: 'post deleted successfully' })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(@Param('post_id') postId: string) {
    await this.postService.delete(postId);
  }
}
