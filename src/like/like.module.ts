import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { PostLike } from './like.entity';
import { LikeRepository } from './like.repository';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [forwardRef(() => PostModule), TypeOrmModule.forFeature([PostLike, LikeRepository])],
  providers: [LikeService, LikeRepository],
  controllers: [LikeController],
  exports: [LikeRepository],
})
export class LikeModule {}
