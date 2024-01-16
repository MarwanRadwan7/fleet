import { Body, Controller, Req, UseGuards, Post, Delete, HttpCode, Param } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { FollowService } from './follow.service';
import { CreateFollowDto, DeleteFollowDto } from './dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async follow(@Req() req, @Body() followBody: CreateFollowDto) {
    await this.followService.follow(req.user.id, followBody);
    return { statusCode: 201, message: 'user followed successfully' };
  }

  @Delete('/:user_id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async unFollow(@Req() req, @Param('user_id') followingId: string) {
    const payload: DeleteFollowDto = { user_id: req.user.id, following_id: followingId };
    await this.followService.unFollow(payload);
  }
}
