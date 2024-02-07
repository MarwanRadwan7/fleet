import { Module } from '@nestjs/common';

import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PostModule, UserModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
