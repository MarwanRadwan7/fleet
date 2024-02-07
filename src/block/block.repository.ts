import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { Block } from './block.entity';
import { IBlockRepository } from './contract';

@Injectable()
export class BlockRepository implements IBlockRepository {
  private blockRepository: Repository<Block>;

  constructor(@InjectRepository(Block) blockRepository: Repository<Block>) {
    this.blockRepository = blockRepository;
  }

  async isBlocked(userId: string, friendId: string): Promise<boolean> {
    try {
      // Check the UUID type
      const isValidUUID = isUUID(userId) && isUUID(friendId);
      if (!isValidUUID) return false;

      // Check the post
      const block = await this.blockRepository
        .createQueryBuilder('b')
        .select('1')
        .where(
          '(b.user_id = :userId AND b.friend_id = :friendId) OR (b.user_id = :friendId AND b.friend_id = :userId)',
          {
            userId,
            friendId,
          },
        )
        .getRawOne();

      if (isValidUUID && block) return true;

      return false;
    } catch (err) {
      throw err;
    }
  }

  async createBlock(userId: string, friendId: string): Promise<void> {
    try {
      const block = this.blockRepository.create({
        userId: { id: userId },
        friendId: { id: friendId },
      });
      await this.blockRepository.save(block);
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  async removeBlock(userId: string, friendId: string): Promise<void> {
    try {
      const block = await this.blockRepository.findOne({
        where: {
          userId: { id: userId },
          friendId: { id: friendId },
        },
      });
      await this.blockRepository.remove(block);
    } catch (err) {
      // Rollback
      throw err;
    }
  }
}
