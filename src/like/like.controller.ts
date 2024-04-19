import { Body, Controller, Req, UseGuards, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guard';
import { LikeService } from './like.service';
import { CreateLikePostDto } from './dto';
@Controller('like')
@ApiTags('Like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({ summary: 'Likes a post' })
  @ApiCreatedResponse({
    description: 'like created successfully',
  })
  @ApiNotFoundResponse({ description: 'user or post not found' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({
    required: true,
    type: CreateLikePostDto,
  })
  async like(@Req() req, @Body() payload: CreateLikePostDto) {
    const liked = await this.likeService.like(req.user.userID, payload);
    return { statusCode: 201, ...liked };
  }

  // TODO: Add like for comments
}
