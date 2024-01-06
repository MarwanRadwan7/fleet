import { Body, Controller, Req, UseGuards, Post, Delete, HttpCode, Param } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('/')
  @UseGuards(JwtGuard)
  async follow(@Req() req, @Body() blockBody: CreateBlockDto) {
    await this.blockService.block(req.user.id, blockBody);
    return { statusCode: 201, message: 'user blocked successfully' };
  }
  @Delete('/:friendId')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async unFollow(@Req() req, @Param('friendId') friendId: string) {
    await this.blockService.unBlock(req.user.id, friendId);
  }
}
