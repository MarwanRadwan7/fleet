import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlockDto {
  @IsNotEmpty()
  @IsString()
  blockedId: string;
}
