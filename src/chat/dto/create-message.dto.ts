import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageDto {
  message: string;
  senderId: string;
  roomId: string;
}
