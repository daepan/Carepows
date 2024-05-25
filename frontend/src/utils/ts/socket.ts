import { io } from 'socket.io-client';

const SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const socket = io(SERVER_URL,  {
  transports: ['websocket'],
  withCredentials: true,
  reconnectionAttempts: 5,
});
