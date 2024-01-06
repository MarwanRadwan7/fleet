import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { BlockModule } from 'src/block/block.module';
import { BlockService } from 'src/block/block.service';

@Module({
  imports: [BlockModule],
  controllers: [FollowController],
  providers: [FollowService, BlockService],
})
export class FollowModule {}
