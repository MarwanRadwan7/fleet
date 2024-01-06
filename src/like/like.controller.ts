import { Body, Controller, Req, UseGuards, Post } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { LikeService } from './like.service';
import { CreateLikePostDto } from './dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async follow(@Req() req, @Body() likeBody: CreateLikePostDto) {
    const liked = await this.likeService.like(req.user.id, likeBody);
    return { statusCode: 201, ...liked };
  }

  // TODO: Add like for comments
}
