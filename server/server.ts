import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import schedule from 'node-schedule';

interface Room {
  id: string;
  name: string;
  isOpen: boolean;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const rooms: Record<string, Room> = {}; // 간단한 방 관리를 위한 객체

app.use(express.static('public'));

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 소켓 연결 설정
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('create-room', (name: string) => {
    const roomId = generateRoomId();
    rooms[roomId] = { id: roomId, name, isOpen: false };
    socket.join(roomId);
    io.emit('room-created', rooms[roomId]);
  });

  socket.on('delete-room', (roomId: string) => {
    delete rooms[roomId];
    io.emit('room-deleted', roomId);
  });

  socket.on('get-rooms', () => {
    socket.emit('rooms-list', rooms);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 방 ID 생성 함수
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// 예약된 시간에 방을 열기 위한 스케줄러
function scheduleRoomOpening(roomId: string, date: Date) {
  schedule.scheduleJob(date, () => {
    if (rooms[roomId]) {
      rooms[roomId].isOpen = true;
      io.to(roomId).emit('room-opened', roomId);
    }
  });
}

// 예제로 방 하나를 예약
scheduleRoomOpening('123456', new Date(Date.now() + 5000)); // 5초 후에 방을 엽니다

// 서버 실행
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
