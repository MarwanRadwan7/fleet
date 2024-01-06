import {
  Body,
  Controller,
  Req,
  UseGuards,
  Post,
  Patch,
  Param,
  Get,
  HttpCode,
  Delete,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateCommentPostDto, GetCommentPostDto, UpdateCommentPostDto } from './dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async create(@Req() req, @Body() commentBody: CreateCommentPostDto) {
    const comment = await this.commentService.create(req.user.id, commentBody);
    return { statusCode: 201, message: 'comment created successfully', data: comment };
  }
  @Patch('/:commentId')
  @UseGuards(JwtGuard)
  async update(
    @Req() req,
    @Param('commentId') commentId: string,
    @Body() commentBody: UpdateCommentPostDto,
  ) {
    const comment = await this.commentService.update(req.user.id, commentId, commentBody);
    return { statusCode: 200, message: 'comment updated successfully', data: comment };
  }
  @Get('/:commentId')
  @UseGuards(JwtGuard)
  async get(@Req() req, @Body() commentBody: GetCommentPostDto) {
    const comment = await this.commentService.get(req.user.id, commentBody);
    return { statusCode: 200, message: 'comment retrieved successfully', data: comment };
  }
  @Delete('/:commentId')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  async comment(@Req() req, @Param('commentId') commentId: string) {
    await this.commentService.delete(req.user.id, commentId);
  }
}
