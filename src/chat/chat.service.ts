import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Room } from './entities';
import { SocketWithAuth } from 'src/types';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { MessageRepository, RoomRepository } from './repositories';
import {
  CreatePrivateMessageDto,
  CreatePrivateRoomDto,
  CreatePublicRoomDto,
  JoinRoomDto,
  UpdateMessageDto,
} from './dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async isRoomExist(payload: JoinRoomDto): Promise<boolean> {
    try {
      return await this.roomRepository.isExist(payload.name);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // This function makes the user "Online" in all his chat rooms "Public + Private"
  initJoin(rooms: Room[], client: SocketWithAuth) {
    try {
      let roomsToJoin = [];
      rooms.forEach(room => roomsToJoin.push(room.name));
      client.join(roomsToJoin);
    } catch (err) {
      console.error(err);
    }
  }

  async findRoomByName(payload: JoinRoomDto): Promise<Room | undefined> {
    try {
      return await this.roomRepository.findOneByName(payload.name);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async joinRoom(room: Room, user: User): Promise<boolean> {
    try {
      if (room.isPrivate && room.members.length >= 2) {
        return false;
      }
      room.members.push(user);
      await this.roomRepository.save(room);
      return true;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findMyRoomsWithMembers(): Promise<Room[] | undefined> {
    try {
      return await this.roomRepository.findMyRooms();
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async createPublicRoom(payload: CreatePublicRoomDto): Promise<Room | undefined> {
    try {
      return await this.roomRepository.createPublicRoom(payload.name);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // Creates a private room if no one exists with provided name
  async createPrivateRoom(senderId: string, payload: CreatePrivateRoomDto) {
    try {
      const sender = await this.userRepository.findById(senderId);
      const receiver = await this.userRepository.findById(payload.receiver);
      return await this.roomRepository.createPrivateRoom(sender, receiver);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async createPrivateMessage(senderId: string, payload: CreatePrivateMessageDto) {
    try {
      const sender = await this.userRepository.findById(senderId);
      const prvRoom = await this.roomRepository.findOneById(payload.room);
      return await this.messageRepository.createPrivateMessage(payload.text, sender, prvRoom);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async findMyRooms(userId: string) {
    return (await this.userRepository.findChatRooms(userId)).rooms;
  }

  async findMyPrivateRooms(userId: string) {
    return (await this.userRepository.findChatRooms(userId)).rooms.filter(room => room.isPrivate);
  }

  async findMyPublicRooms(userId: string) {
    return (await this.userRepository.findChatRooms(userId)).rooms.filter(room => !room.isPrivate);
  }

  async findOne(mgsId: string): Promise<any> {
    try {
      const msg = await this.messageRepository.findOne(mgsId);

      return msg;
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }

  async find(): Promise<any> {
    try {
      const msg = await this.messageRepository.findAll();

      return msg;
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }

  async update(payload: UpdateMessageDto): Promise<any> {
    try {
      const comment = await this.messageRepository.update(payload);

      return comment;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async delete(mgsId: string): Promise<void> {
    try {
      await this.messageRepository.delete(mgsId);
    } catch (err) {
      console.error(err);

      throw new InternalServerErrorException();
    }
  }
}
