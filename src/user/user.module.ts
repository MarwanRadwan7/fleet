import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PostService } from 'src/post/post.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, PostService, CloudinaryProvider],
})
export class UserModule {}
