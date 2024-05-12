import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

export const socket = io(SERVER_URL,  {
  transports: ['websocket'],
  withCredentials: true,
  reconnectionAttempts: 5,
});
