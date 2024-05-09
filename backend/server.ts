import express from 'express';
import http from 'http';

import { Server as SocketIOServer } from 'socket.io';
const cors = require('cors')

let corsOptions = {
  origin: '*',      // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 등) 접근
}

const doctors = [
  {
    id: 1,
    userId: "qw03011",
    password: "1234",
    name: "김대관",
    number: "042-472-8480",
    describe: "성실하게 임하겠습니다.",
    location: "대전패트릭동물병원",
  },
  {
    id: 2,
    name: "김형진",
    userId: "hy123",
    password: "1234",
    number: "041-422-8610",
    describe: "잘 임하겠습니다.",
    location: "서울진사동물병원",
  },
  {
    id: 3,
    name: "전민서",
    userId: "ms123",
    password: "1234",
    number: "02-725-8508",
    describe: "열심히 임하겠습니다.",
    location: "청주펫케어병원",
  },
];

interface Room {
  id: string;
  name: string;
  isOpen: boolean;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(cors(corsOptions))
const rooms: Record<string, Room> = {};

function createRoom(name: string, roomId: string): Room {
  const room: Room = { id: roomId, name, isOpen: true };
  rooms[roomId] = room;
  return room;
}

// 사전에 방 세 개 생성
createRoom("Chat Room 1", '0');
createRoom("Chat Room 2", '1');
createRoom("Chat Room 3", '2');

app.use(express.static('public'));
app.use("/", express.static(`${process.cwd()}/../frontend/build`));
app.use(express.json());

app.post('/login', (req, res) => {
  const { userId, password } = req.body;
  const doctor = doctors.find(d => d.userId === userId && d.password === password);

  if (doctor) {
    res.json({
      success: true,
      message: '로그인 성공!',
      data: doctor
    });
  } else {
    res.status(401).json({
      success: false,
      message: '아이디 또는 비밀번호가 잘못되었습니다.'
    });
  }
});
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('get-rooms', () => {
    socket.emit('rooms-list', Object.values(rooms));
  });

  socket.on('join-room', (roomId: string) => {
    console.log(`User joined room: ${roomId}`);
    if (rooms[roomId] && rooms[roomId].isOpen) {
      socket.join(roomId);

      const otherUsers = io.sockets.adapter.rooms.get(roomId);
      if (otherUsers && otherUsers.size > 1) {
        // 방에 이미 다른 사용자가 있으면 연결을 시작합니다.
        socket.emit('other-user', Array.from(otherUsers).find(id => id !== socket.id));
        socket.to(Array.from(otherUsers).find(id => id !== socket.id)!).emit('user-joined', socket.id);
      }
      
      socket.emit('joined-room', roomId);
    } else {
      socket.emit('error', 'Room is not available');
    }
  });

  socket.on('sending-signal', payload => {
    console.log('Sending signal to', payload.userToSignal);
    io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerId: payload.callerId });
  });

  socket.on('returning-signal', payload => {
    console.log('Returning signal to', payload.callerId);
    io.to(payload.callerId).emit('receiving-returned-signal', { signal: payload.signal });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (const room in rooms) {
      if (rooms.hasOwnProperty(room)) {
        const roomUsers = io.sockets.adapter.rooms.get(room);
        if (roomUsers && roomUsers.size === 0) {
          delete rooms[room];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
