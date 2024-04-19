import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { BlockRepository } from './block.repository';
import { Block } from './block.entity';
import { FollowModule } from 'src/modules/follow/follow.module';

@Module({
  imports: [forwardRef(() => FollowModule), TypeOrmModule.forFeature([Block, BlockRepository])],
  controllers: [BlockController],
  providers: [BlockService, BlockRepository],
  exports: [BlockService, BlockRepository],
})
export class BlockModule {}
