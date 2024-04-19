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
  CreateCommentPostResponseDtoExample,
  GetCommentPostResponseDtoExample,
  UpdateCommentPostDto,
  UpdateCommentPostResponseDtoExample,
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
    type: CreateCommentPostResponseDtoExample,
  })
  @ApiNotFoundResponse({ description: 'post not fount' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: CreateCommentPostDto,
  })
  async create(@Req() req, @Body() payload: CreateCommentPostDto) {
    const comment = await this.commentService.create(req.user.userID, payload);
    return { statusCode: 201, message: 'comment created successfully', data: comment };
  }

  @Patch('/:comment_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Updates a comment on a post' })
  @ApiOkResponse({
    description: 'comment updated successfully',
    type: UpdateCommentPostResponseDtoExample,
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
    const comment = await this.commentService.update(commentId, payload);
    return { statusCode: 200, message: 'comment updated successfully', data: comment };
  }

  @Get('/:comment_id')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Gets a comment on a post' })
  @ApiOkResponse({
    description: 'comment retrieved successfully',
    type: GetCommentPostResponseDtoExample,
  })
  @ApiNotFoundResponse({ description: 'post not fount' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async get(@Req() req, @Param('comment_id') commentId: string) {
    const comment = await this.commentService.get(commentId);
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
    await this.commentService.delete(commentId);
  }
}
