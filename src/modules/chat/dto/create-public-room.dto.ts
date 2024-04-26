import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePublicRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class CreatePublicRoomRespExample {
  @ApiProperty({
    example: {
      pubRoom: {
        name: 'example',
        isPrivate: false,
        id: '76720973-0efd-4f35-a918-9c93154a8629',
        createdAt: '2024-04-22T17:42:47.258Z',
        updatedAt: '2024-04-22T17:42:47.258Z',
      },
    },
  })
  pubRoom: {
    id: string;
    name: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
