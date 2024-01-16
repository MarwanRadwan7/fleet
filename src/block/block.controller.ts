import { Body, Controller, Req, UseGuards, Post, Delete, HttpCode, Param } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async block(@Req() req, @Body() blocked_id: string) {
    const payload: CreateBlockDto = { user_id: req.user.id, blocked_id };
    await this.blockService.block(payload);
    return { statusCode: 201, message: 'user blocked successfully' };
  }

  @Delete('/:friend_id')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async unBlock(@Req() req, @Param('friend_id') friend_id: string) {
    await this.blockService.unBlock(req.user.id, friend_id);
  }
}
