import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Message, Room } from '../entities';
import { User } from 'src/user/user.entity';
import { PageOptionsDto } from 'src/common/dto/pagination';

@Injectable()
export class MessageRepository {
  private messageRepository: Repository<Message>;

  constructor(@InjectRepository(Message) messageRepository: Repository<Message>) {
    this.messageRepository = messageRepository;
  }

  async create(message: string, sender: User, room: Room): Promise<Message> {
    const createdMessage = new Message();
    createdMessage.message = message;
    createdMessage.sender = sender;
    createdMessage.room = room;
    await this.messageRepository.save(createdMessage);
    return createdMessage;
  }

  async update(msgId: string, text: string) {
    return await this.messageRepository.update(msgId, {
      isEdited: true,
      message: text,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(msgId: string) {
    return await this.messageRepository.delete(msgId);
  }

  async findOne(msgId: string) {
    return this.messageRepository.findOne({ where: { id: msgId }, relations: ['sender'] });
  }

  async findRoomMessages(roomId: string, pageOptions: PageOptionsDto): Promise<Message[]> {
    return await this.messageRepository.find({
      relations: {
        sender: true,
        room: true,
      },
      where: {
        room: {
          id: roomId,
        },
      },
      skip: pageOptions.skip,
      take: pageOptions.take,
      order: {
        createdAt: pageOptions.order,
      },
    });
  }
}
