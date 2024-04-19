import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePrivateMessageDto {
  // Content of the message
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string;

  // Id of the receiver -- used to get the socket from the cache
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  receiver: string;

  // Id of the chat room
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  room: string;

  constructor(text, room) {
    this.text = text;
    this.room = room;
  }
}
