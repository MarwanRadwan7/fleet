import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMessageDto {
  id: string;
  message: string;
  authorId: string;
  conversationId: string;
}
