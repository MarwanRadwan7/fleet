import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';

import { ServerToClientEvents } from './types/events';
import { Message } from '../chat/entities';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WsJwtGuard)
export class EventsGateway {
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  sendMessage(msg: Message) {
    this.server.emit('newMessage', msg);
    // socket.emit("newMessage", "helloMessage from server")
  }
}
