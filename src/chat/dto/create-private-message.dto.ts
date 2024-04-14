'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string;

  @IsUUID()
  @ApiProperty()
  receiver: string;

  @IsUUID()
  @ApiProperty()
  room: string;

  constructor(text, room) {
    this.text = text;
    this.room = room;
  }
}
