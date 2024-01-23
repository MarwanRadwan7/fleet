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
import {
  ApiBody,
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

import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guard';
import {
  CreateCommentPostDto,
  CreateCommentPostResponseDto,
  DeleteCommentPostDto,
  GetCommentPostDto,
  GetCommentPostResponseDto,
  UpdateCommentPostDto,
  UpdateCommentPostResponseDto,
} from './dto';

@Controller('comments')
@ApiTags('Comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Creates a comment on a post' })
  @ApiCreatedResponse({
    description: 'comment created successfully',
    type: CreateCommentPostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'post not fount' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: CreateCommentPostDto,
  })
  async create(@Req() req, @Body() payload: CreateCommentPostDto) {
    const comment = await this.commentService.create(req.user.id, payload);
    return { statusCode: 201, message: 'comment created successfully', data: comment };
  }

  @Patch('/:comment_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Updates a comment on a post' })
  @ApiOkResponse({
    description: 'comment updated successfully',
    type: UpdateCommentPostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'post not fount' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: UpdateCommentPostDto,
  })
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
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets a comment on a post' })
  @ApiOkResponse({
    description: 'comment retrieved successfully',
    type: GetCommentPostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'post not fount' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: GetCommentPostDto,
  })
  async get(@Req() req, @Param('comment_id') commentId: string) {
    const commentInfo: GetCommentPostDto = { user_id: req.user.id, comment_id: commentId };
    const comment = await this.commentService.get(commentInfo);
    return { statusCode: 200, message: 'comment retrieved successfully', data: comment };
  }

  @Delete('/:comment_id')
  @HttpCode(204)
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Deletes an existing comment on post' })
  @ApiNoContentResponse({ description: 'comment deleted successfully' })
  @ApiNotFoundResponse({ description: 'comment not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async comment(@Req() req, @Param('comment_id') commentId: string) {
    const commentInfo: DeleteCommentPostDto = { user_id: req.user.id, comment_id: commentId };
    await this.commentService.delete(commentInfo);
  }
}
