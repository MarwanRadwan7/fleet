import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Follower, Following } from './follow.entity';
import { IFollowRepository } from './contract/contract';
import { connectionSource } from 'src/config/typeorm';
import { Pagination } from 'src/common/decorator/pagination';
import { FollowsUserDataDto } from './dto';

@Injectable()
export class FollowRepository implements IFollowRepository {
  private followingsRepository: Repository<Following>;
  private followersRepository: Repository<Follower>;

  constructor(
    @InjectRepository(Following) followingsRepository: Repository<Following>,
    @InjectRepository(Follower) followersRepository: Repository<Follower>,
  ) {
    this.followingsRepository = followingsRepository;
    this.followersRepository = followersRepository;
  }

  async isFollowed(userId: string, followingId: string): Promise<boolean> {
    return await this.followingsRepository.exists({
      where: {
        userId: { id: userId },
        followingId: { id: followingId },
      },
    });
  }

  async createFollow(userId: string, followingId: string): Promise<void> {
    const following = this.followingsRepository.create({
      userId: { id: userId },
      followingId: { id: followingId },
    });

    const follower = this.followersRepository.create({
      userId: { id: followingId },
      followerId: { id: userId },
    });

    // Open a connection for an transaction
    const queryRunner = connectionSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Operations
      await this.followingsRepository.save(following);
      await this.followersRepository.save(follower);

      // Commit
      await queryRunner.commitTransaction();
    } catch (err) {
      // Rollback
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release the connection
      await queryRunner.release();
    }
  }

  async deleteFollow(userId: string, followingId: string): Promise<void> {
    // Find the records
    const following = await this.followingsRepository.findOne({
      where: {
        userId: { id: userId },
        followingId: {
          id: followingId,
        },
      },
    });

    const follower = await this.followersRepository.findOne({
      where: {
        userId: { id: followingId },
        followerId: {
          id: userId,
        },
      },
    });

    // Open a connection for an transaction
    const queryRunner = connectionSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Operations
      await this.followingsRepository.remove(following);
      await this.followersRepository.remove(follower);

      // Commit
      await queryRunner.commitTransaction();
    } catch (err) {
      // Rollback
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Release the connection
      await queryRunner.release();
    }
  }

  async getUserFollowings(userId: string, page: Pagination): Promise<FollowsUserDataDto[]> {
    const followings = await this.followingsRepository
      .createQueryBuilder('f')
      .select([
        'u.id AS "userId"',
        'u.username AS username',
        'u.first_name AS "firstName"',
        'u.last_name AS "lastName"',
        'u.avatar AS avatar',
      ])
      .leftJoin('users', 'u', 'f.following_id = u.id')
      .where('f.user_id = :userId', { userId })
      .limit(page.limit)
      .offset(page.offset)
      .getRawMany();

    return followings;
  }

  async getUserFollowers(userId: string, page: Pagination): Promise<FollowsUserDataDto[]> {
    const followers = await this.followersRepository
      .createQueryBuilder('f')
      .select([
        'u.id AS "userId"',
        'u.username AS username',
        'u.first_name AS "firstName"',
        'u.last_name AS "lastName"',
        'u.avatar AS avatar',
      ])
      .leftJoin('users', 'u', 'f.follower_id = u.id')
      .where('f.user_id = :userId', { userId })
      .limit(page.limit)
      .offset(page.offset)
      .getRawMany();

    return followers;
  }
}
