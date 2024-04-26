import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePrivateRoomDto {
  @IsUUID()
  @ApiProperty()
  receiver: string;
}
export class CreatePrivateRoomRespExample {
  @ApiProperty()
  PrvRoom: {
    name: string;
    isPrivate: boolean;
    members: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      bio: string | null;
      avatar: string;
      birthDate: string;
      phone: string;
      isActive: boolean;
      updatedAt: string;
    };
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}
