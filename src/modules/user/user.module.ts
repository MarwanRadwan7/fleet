import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PostModule } from 'src//modules/post/post.module';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { FollowModule } from 'src/modules/follow/follow.module';

@Module({
  imports: [
    CloudinaryModule,
    FollowModule,
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([User, UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
