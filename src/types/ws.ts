import { Socket } from 'socket.io';

type AuthPayload = {
  userID: string;
  username: string;
  role: string;
  email: string;
};
export type SocketWithAuth = Socket & AuthPayload;
