import { Module, forwardRef } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './comment.entity';
import { CommentRepository } from './comment.repository';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([PostComment, CommentRepository]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentRepository],
})
export class CommentModule {}
