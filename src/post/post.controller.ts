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
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { CreatePostDto } from './dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async create(@Req() req, @Body() postBody: CreatePostDto) {
    const post = await this.postService.create(req.user.id, req.user.sub.username, postBody);
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
