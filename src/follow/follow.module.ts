import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { BlockModule } from 'src/block/block.module';
import { FollowRepository } from './follow.repository';
import { Follower, Following } from './follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Following, Follower, FollowRepository]),
    forwardRef(() => BlockModule),
  ],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowRepository],
})
export class FollowModule {}
