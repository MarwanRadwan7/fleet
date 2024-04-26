import { Message } from '../../chat/entities';

export interface ServerToClientEvents {
  newMessage: (payload: Message) => void;
}
