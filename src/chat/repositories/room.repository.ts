import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Room } from '../entities';
import { User } from 'src//modules/user/user.entity';

@Injectable()
export class RoomRepository {
  private roomRepository: Repository<Room>;

  constructor(@InjectRepository(Room) roomRepository: Repository<Room>) {
    this.roomRepository = roomRepository;
  }

  async isExist(name: string): Promise<boolean> {
    return await this.roomRepository.exists({
      where: {
        name,
      },
    });
  }

  async createPublicRoom(roomName: string): Promise<Room> {
    try {
      const room = this.roomRepository.create({
        name: roomName,
        isPrivate: false,
      });
      return await this.roomRepository.save(room);
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  async createPrivateRoom(sender: User, receiver: User): Promise<Room> {
    try {
      // Use this initialization with typeORM
      // if you define a record has Many-to-Many relation
      const prvRoom = new Room();
      prvRoom.name = this.generatePrivateRoomName(sender, receiver);
      prvRoom.isPrivate = true;
      prvRoom.members = [sender, receiver];

      return await this.roomRepository.save(prvRoom);
    } catch (err) {
      // Rollback
      throw err;
    }
  }

  // TODO: Delete publicRoom
  // TODO: Update publicRoom

  // FIXME: Fix the saving and using upsert
  async save(room: Room): Promise<Room> {
    return await this.roomRepository.save(room);
  }

  async findOneByName(name: string): Promise<Room> {
    return await this.roomRepository.findOne({ where: { name }, relations: { members: true } });
  }

  async findOneById(id: string): Promise<Room | undefined> {
    return await this.roomRepository.findOne({ where: { id }, relations: { members: true } });
  }

  async delete(id: string): Promise<any> {
    return this.roomRepository.delete(id);
  }

  private generatePrivateRoomName(sender, receiver): string {
    if (sender.username.localeCompare(receiver.username) === -1) {
      // firstUsername is "<" (before) secondUsername
      return sender.username + '-' + receiver.username;
    } else if (sender.username.localeCompare(receiver.username) === 1) {
      // firstUsername is ">" (after) secondUsername
      return receiver.username + '-' + sender.username;
    } else {
      return 'FORBIDDEN'; // ids are equal, should throw an error
    }
  }
}
