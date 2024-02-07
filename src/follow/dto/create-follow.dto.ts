import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty({ example: 'cc0dee72-7d82-4310-bdd9-b9babb141f87' })
  @IsNotEmpty()
  @IsString()
  followingId: string;
}
