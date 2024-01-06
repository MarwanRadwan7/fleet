import { Body, Controller, Req, UseGuards, Post, Delete, HttpCode, Param } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async follow(@Req() req, @Body() followBody: CreateFollowDto) {
    await this.followService.follow(req.user.id, followBody);
    return { statusCode: 201, message: 'user followed successfully' };
  }
  @Delete('/:friendId')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async unFollow(@Req() req, @Param('friendId') friendId: string) {
    await this.followService.unFollow(req.user.id, friendId);
  }
}
