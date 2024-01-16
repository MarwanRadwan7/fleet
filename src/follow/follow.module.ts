import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { BlockModule } from 'src/block/block.module';

@Module({
  imports: [BlockModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
