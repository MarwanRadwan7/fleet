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
import {
  CreateCommentPostDto,
  DeleteCommentPostDto,
  GetCommentPostDto,
  UpdateCommentPostDto,
} from './dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async create(@Req() req, @Body() payload: CreateCommentPostDto) {
    payload.user_id = req.user.id;
    const comment = await this.commentService.create(payload);
    return { statusCode: 201, message: 'comment created successfully', data: comment };
  }

  @Patch('/:comment_id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req,
    @Param('comment_id') commentId: string,
    @Body() payload: UpdateCommentPostDto,
  ) {
    payload.user_id = req.user.id;
    payload.comment_id = commentId;
    const comment = await this.commentService.update(payload);
    return { statusCode: 200, message: 'comment updated successfully', data: comment };
  }

  @Get('/:comment_id')
  @UseGuards(JwtGuard)
  async get(@Req() req, @Param('comment_id') commentId: string) {
    const commentInfo: GetCommentPostDto = { user_id: req.user.id, comment_id: commentId };
    const comment = await this.commentService.get(commentInfo);
    return { statusCode: 200, message: 'comment retrieved successfully', data: comment };
  }

  @Delete('/:comment_id')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  async comment(@Req() req, @Param('comment_id') commentId: string) {
    const commentInfo: DeleteCommentPostDto = { user_id: req.user.id, comment_id: commentId };
    await this.commentService.delete(commentInfo);
  }
}
