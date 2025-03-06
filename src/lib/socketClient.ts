import { io, Socket } from 'socket.io-client';

let socket: Socket;
// should be changed to an env variable when deploying
const SOCKET_URL = 'http://localhost:3000';

export const connectSocket = () => {
  if (typeof window !== 'undefined') {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });
  }
};

export const sendMessage = (message: string) => {
  if (socket) {
    socket.emit('message', message);
  }
};

export const onMessage = (callback: (data: string) => void) => {
  if (socket) {
    socket.on('message', callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
