'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePrivateRoomDto {
  @IsUUID()
  @ApiProperty()
  receiver: string;
}
