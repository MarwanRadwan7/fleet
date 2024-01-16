import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { DbModule } from 'src/db/db.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [DbModule, PostModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
