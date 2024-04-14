import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message, Room } from '../entities';
import { UpdateMessageDto } from '../dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class MessageRepository {
  private messageRepository: Repository<Message>;

  constructor(@InjectRepository(Message) messageRepository: Repository<Message>) {
    this.messageRepository = messageRepository;
  }

  // FIXME: Delete all the try-catch blocks and only use the repo in the service not gateway

  async createPrivateMessage(
    message: string,
    sender: User,
    room: Room,
  ): Promise<Message | undefined> {
    try {
      const createdMessage = new Message();
      createdMessage.message = message;
      createdMessage.sender = sender;
      createdMessage.room = room;
      await this.messageRepository.save(createdMessage);
      return createdMessage;
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      return this.messageRepository.findOne({ where: { id } });
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  async update(payload: UpdateMessageDto): Promise<any> {
    try {
      return await this.messageRepository.update(payload.id, {
        message: payload.message,
      });
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  async findAll(): Promise<any> {
    try {
      return this.messageRepository.find();
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      return this.messageRepository.delete(id);
    } catch (err) {
      // Rollback
      throw err;
    }
  }
}
