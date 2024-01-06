import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [ConfigModule, DbModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
