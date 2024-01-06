import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';
import { BlockModule } from './block/block.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, DbModule, AuthModule, PostModule, FollowModule, BlockModule],
})
export class AppModule {}
