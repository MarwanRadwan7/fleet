import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DbModule } from 'src/db/db.module';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule, DbModule, CloudinaryModule],
  controllers: [PostController],
  providers: [PostService, CloudinaryProvider],
})
export class PostModule {}
