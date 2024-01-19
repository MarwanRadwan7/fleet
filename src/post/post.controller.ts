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

import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { ParsePipe, SharpTransformPipe } from 'src/common/pipe';
import { UserDataDto } from 'src/user/dto/data-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  CreatePostDto,
  CreatePostResponseDto,
  GetPostCommentsResponseDto,
  GetPostDataDto,
  GetPostLikesResponseDto,
  GetPostResponseDto,
  UpdatePostDto,
} from './dto';
import { Pagination, PaginationParams } from 'src/common/decorator/pagination';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('media'))
  async create(
    @Req() req,
    @UploadedFile(ParsePipe, SharpTransformPipe)
    media: Express.Multer.File,
    @Body()
    payload: CreatePostDto,
  ) {
    const userData: UserDataDto = { user_id: req.user.id, username: req.user.sub.username };
    let post: CreatePostResponseDto;
    payload['media_url'] = null;

    if (media) {
      payload['media_url'] = (await this.cloudinaryService.uploadFile(media)).secure_url;
      post = await this.postService.create(userData, payload);
    } else {
      post = await this.postService.create(userData, payload);
    }

    return { statusCode: 201, message: 'post created successfully', data: { post } };
  }

  @Patch('/:post_id')
  @UseGuards(JwtGuard)
  async update(@Req() req, @Param('post_id') postId: string, @Body() postBody: UpdatePostDto) {
    const payload: UpdatePostDto = { user_id: req.user.id, post_id: postId, ...postBody };
    const post = await this.postService.update(payload);
    return { statusCode: 200, message: 'post updated successfully', data: { post } };
  }

  @Get('/:post_id')
  @UseGuards(JwtGuard)
  async getById(@Req() req, @Param('post_id') postId: string) {
    const post: GetPostResponseDto = await this.postService.getById(postId);
    return { statusCode: 200, message: 'post retrieved successfully', data: { post } };
  }

  @Get('/:post_id/likes')
  @UseGuards(JwtGuard)
  async getPostLikes(
    @PaginationParams() paginationParams: Pagination,
    @Param('post_id') postId: string,
  ) {
    const payload: GetPostDataDto = { post_id: postId };
    const likes: GetPostLikesResponseDto = await this.postService.getPostLikes(
      payload,
      paginationParams,
    );
    return { statusCode: 200, message: 'likes retrieved successfully', data: { ...likes } };
  }

  @Get('/:post_id/comments')
  @UseGuards(JwtGuard)
  async getPostComments(
    @PaginationParams() paginationParams: Pagination,
    @Param('post_id') postId: string,
  ) {
    const payload: GetPostDataDto = { post_id: postId };
    const comments: GetPostCommentsResponseDto = await this.postService.getPostComments(
      payload,
      paginationParams,
    );
    return { statusCode: 200, message: 'comments retrieved successfully', data: { ...comments } };
  }

  @Delete('/:post_id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async delete(@Param('post_id') postId: string) {
    await this.postService.delete(postId);
  }
}
