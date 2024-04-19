import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';

import { Message, Room } from './entities';
import { SocketWithAuth } from 'src/types';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { MessageRepository, RoomRepository } from './repositories';
import {
  CreatePrivateMessageDto,
  CreatePublicMessageDto,
  CreatePrivateRoomDto,
  CreatePublicRoomDto,
  JoinRoomDto,
  UpdateMessageDto,
} from './dto';
import { PageOptionsDto } from 'src/common/dto/pagination';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * `isRoomExist` Checks if the chat room either pub/priv exists or not.
   * @param payload An object contains the `name` of the room.
   * @returns A promise of boolean indicates whether the chat room exists or not.
   */
  async isRoomExist(payload: JoinRoomDto): Promise<boolean> {
    try {
      return await this.roomRepository.isExist(payload.name);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * `initJoin` makes the user "Online" in all his chat rooms "Public + Private".
   * @param rooms Array of rooms of type `Room` entity the user is member in them.
   * @param client Client of the current connected socket.
   */
  async initJoin(rooms: Room[], client: SocketWithAuth): Promise<void> {
    try {
      const roomsToJoin = [];
      rooms.forEach(room => roomsToJoin.push(room.name));
      await client.join(roomsToJoin);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * `findRoomByName` uses the `roomRepository` to find the room by its name.
   * @param payload An object contains the `name` of the room.
   * @returns A promise with the data of the room of type `Room`.
   */
  async findRoomByName(payload: JoinRoomDto): Promise<Room | undefined> {
    try {
      return await this.roomRepository.findOneByName(payload.name);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * `joinPublicRoom` for adding an user to a public chat room.
   * @param room room of type `Room` entity.
   * @param user user of type `User` entity.
   * @returns A promise of boolean indicates if the user joined the public chat room successfully or not.
   */
  async joinPublicRoom(room: Room, user: User): Promise<boolean> {
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

  /**
   * `createPublicRoom` creates a new public chat room.
   * @param payload An object contains the `name` of the room.
   * @throws {HttpException} if the room already exists or there are missing fields.
   * @returns  A promise with the data of the created room of type `Room`.
   */
  async createPublicRoom(payload: CreatePublicRoomDto): Promise<Room> {
    try {
      return await this.roomRepository.createPublicRoom(payload.name);
    } catch (err) {
      console.error(err);
      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException(
          'public room with the same name already exist',
          HttpStatus.CONFLICT,
        );
      if (err.code === PostgresError.NOT_NULL_VIOLATION)
        throw new HttpException('some fields are required', HttpStatus.BAD_REQUEST);
      throw new InternalServerErrorException();
    }
  }

  /**
   * `createPrivateRoom` Creates a private room between two members.
   * @param senderId The ID of the creator of the private room.
   * @throws {HttpException} if the room already exists or there are missing fields.
   * @param payload An object contains the `receiver` ID in the private room.
   */
  async createPrivateRoom(senderId: string, payload: CreatePrivateRoomDto): Promise<Room> {
    try {
      const sender = await this.userRepository.findById(senderId);
      const receiver = await this.userRepository.findById(payload.receiver);
      return await this.roomRepository.createPrivateRoom(sender, receiver);
    } catch (err) {
      console.error(err);
      if (err.code === PostgresError.UNIQUE_VIOLATION)
        throw new HttpException('private room already exist', HttpStatus.CONFLICT);
      if (err.code === PostgresError.NOT_NULL_VIOLATION)
        throw new HttpException('some fields are required', HttpStatus.BAD_REQUEST);
      throw new InternalServerErrorException();
    }
  }

  /**
   * `createMessage` creates a new message in either public or private chat room.
   * @param senderId The ID of the sender of the message.
   * @param payload An object contains the room ID and the text of the sent message.
   * @returns A promise with the data of the created message of type `Message`.
   */
  async createMessage(
    senderId: string,
    payload: CreatePrivateMessageDto | CreatePublicMessageDto,
  ): Promise<Message> {
    try {
      const sender = await this.userRepository.findById(senderId);
      if (!sender) {
        throw new Error('Could not find the user');
      }
      const prvRoom = await this.roomRepository.findOneById(payload.room);
      if (!prvRoom) {
        throw new Error('Could not find the room');
      }
      return await this.messageRepository.create(payload.text, sender, prvRoom);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * `updateMessage` updates the text of an existing message
   * @param senderId The sender ID of the message
   * @param msgId The ID of the updating message.
   * @param payload An object contains the `text` of the updating message.
   * @throws {HttpException} if the user is not the sender of the message.
   * @returns  A promise with the data of the updated message of type `Message`.
   */
  async updateMessage(senderId: string, msgId: string, payload: UpdateMessageDto) {
    try {
      // check if user has this message
      const realSenderId = (await this.messageRepository.findOne(msgId)).sender.id;
      if (realSenderId !== senderId) {
        throw new HttpException('message does not belong to this user', HttpStatus.BAD_REQUEST);
      }
      await this.messageRepository.update(msgId, payload.text);
      return await this.messageRepository.findOne(msgId);
    } catch (err) {
      console.error(err);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException();
    }
  }

  /**
   * `deleteMessage` deletes an existing message
   * @param msgId The ID of the deleting message.
   * @throws {HttpException} if the user is not the sender of the message.
   */
  async deleteMessage(senderId: string, msgId: string): Promise<void> {
    try {
      // check if user has this message
      const realSenderId = (await this.messageRepository.findOne(msgId)).sender.id;
      if (realSenderId !== senderId) {
        throw new HttpException('message does not belong to this user', HttpStatus.BAD_REQUEST);
      }
      await this.messageRepository.delete(msgId);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  // FIXME: Add the correct pagination for the repo
  /**
   * `findMyRooms` gets all the chat rooms of the user with this `userId`.
   * @param userId ID of the user.
   * @param pageOptionsDto Pagination options.
   * @returns Promise with an array of user 's rooms.
   */
  async findMyRooms(userId: string, pageOptionsDto?: PageOptionsDto): Promise<Room[]> {
    return (await this.userRepository.findChatRooms(userId, pageOptionsDto)).rooms;
  }

  /**
   * `findMessageById` gets a message by its ID.
   * @param msgId ID of the message.
   */
  async findMessageById(msgId: string): Promise<Message> {
    try {
      const msg = await this.messageRepository.findOne(msgId);
      return msg;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * `findRoomMessages` returns messages of the chat room pub/priv.
   * @param roomId The ID of the room that has the messages.
   * @param pageOptionsDto Pagination options.
   * @returns Promise with an array of messages of the rooms.
   */
  async findRoomMessages(roomId: string, pageOptionsDto: PageOptionsDto): Promise<Message[]> {
    try {
      return await this.messageRepository.findRoomMessages(roomId, pageOptionsDto);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
