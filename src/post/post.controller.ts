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

import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { ParsePipe, SharpTransformPipe } from 'src/common/pipe';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Pagination, PaginationParams } from 'src/common/decorator/pagination';
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

@Controller('posts')
@ApiTags('Posts')
@UseGuards(ThrottlerGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
    const userId: string = req.user.userID;
    let post: PostDto;
    payload.mediaUrl = null;

    if (media) {
      payload.mediaUrl = (await this.cloudinaryService.uploadFile(media)).secure_url;
      post = await this.postService.create(userId, payload);
    } else {
      post = await this.postService.create(userId, payload);
    }

    return { statusCode: 201, message: 'post created successfully', data: { post } };
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

    return { statusCode: 200, message: 'post updated successfully', data: { post } };
  }

  @Get('/:post_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets an existing post' })
  @ApiOkResponse({ description: 'post retrieved successfully', type: GetPostResponseDtoExample })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getById(@Req() req, @Param('post_id') postId: string) {
    const post: PostDto = await this.postService.getById(postId);
    return { statusCode: 200, message: 'post retrieved successfully', data: { post } };
  }

  @Get('/:post_id/likes')
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
  async getPostLikes(
    @PaginationParams() paginationParams: Pagination,
    @Param('post_id') postId: string,
  ) {
    const likes: GetPostLikesResponseDto = await this.postService.getPostLikes(
      postId,
      paginationParams,
    );
    return { statusCode: 200, message: 'likes retrieved successfully', data: { ...likes } };
  }

  @Get('/:post_id/comments')
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
  async getPostComments(
    @PaginationParams() paginationParams: Pagination,
    @Param('post_id') postId: string,
  ) {
    const comments: GetPostCommentsResponseDto = await this.postService.getPostComments(
      postId,
      paginationParams,
    );
    return { statusCode: 200, message: 'comments retrieved successfully', data: { ...comments } };
  }

  @Delete('/:post_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Deletes an existing post' })
  @ApiNoContentResponse({ description: 'post deleted successfully' })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(204)
  async delete(@Param('post_id') postId: string) {
    await this.postService.delete(postId);
  }
}
