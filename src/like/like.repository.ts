import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostLike } from './like.entity';
import { Pagination } from 'src/common/decorator/pagination';

export class LikeRepository {
  private likeRepository: Repository<PostLike>;

  constructor(@InjectRepository(PostLike) likeRepository: Repository<PostLike>) {
    this.likeRepository = likeRepository;
  }

  async isLiked(userId: string, postId: string): Promise<boolean> {
    try {
      return await this.likeRepository.exists({
        where: {
          userId: { id: userId },
          postId: { id: postId },
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createLike(userId: string, postId: string): Promise<void> {
    try {
      const like = this.likeRepository.create({
        userId: { id: userId },
        postId: { id: postId },
      });
      await this.likeRepository.save(like);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async removeLike(userId: string, postId: string): Promise<void> {
    try {
      await this.likeRepository.delete({ userId: { id: userId }, postId: { id: postId } });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getPostLikesData(postId: string, page: Pagination): Promise<any> {
    try {
      const likesData = await this.likeRepository
        .createQueryBuilder('l')
        .select([
          'u.id AS "userId"',
          'u.username AS username',
          'u.first_name AS "firstName"',
          'u.last_name AS "lastName"',
          'u.avatar AS avatar',
        ])
        .leftJoin('users', 'u', 'l.user_id = u.id')
        .where('l.post_id= :postId', { postId })
        .limit(page.limit)
        .offset(page.offset)
        .execute();

      return likesData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
