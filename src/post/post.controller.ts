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
import { CreatePostDto, CreatePostType } from './dto';
import { ParsePipe, SharpTransformPipe } from './pipe';
import { UserDataDto } from 'src/user/dto/data-user.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

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
    let post: CreatePostType;
    payload['media_url'] = null;

    if (media) {
      payload['media_url'] = (await this.postService.uploadMedia(media)).secure_url;
      post = await this.postService.create(userData, payload);
    } else {
      post = await this.postService.create(userData, payload);
    }

    return { statusCode: 201, message: 'post created successfully', data: { post } };
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async update(@Req() req, @Param('id') postId: string, @Body() postBody: CreatePostDto) {
    const post = await this.postService.update(req.user.id, postId, postBody);
    return { statusCode: 200, message: 'post updated successfully', data: { post } };
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getById(@Req() req, @Param('id') postId: string) {
    const post = await this.postService.getById(req.user.id, postId);
    return { statusCode: 200, message: 'post retrieved successfully', data: { post } };
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.postService.delete(id);
  }
}
