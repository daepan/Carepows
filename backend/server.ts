import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

interface Doctor {
  id: number;
  userId: string;
  password: string;
  name: string;
  number: string;
  describe: string;
  location: string;
}

const doctors: Doctor[] = [
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

app.post('/login', (req, res) => {
  const { userId, password } = req.body;
  const doctor = doctors.find(d => d.userId === userId && d.password === password);

  if (doctor) {
    res.json({
      success: true,
      message: '로그인 성공!',
      data: doctor,
    });
  } else {
    res.status(401).json({
      success: false,
      message: '아이디 또는 비밀번호가 잘못되었습니다.',
    });
  }
});

interface CustomSocket extends Socket {
  nickname?: string;
}

io.on("connection", (socket: CustomSocket) => {
  console.log(`User connected: ${socket.id}`);
  socket.nickname = "Anonymous";

  socket.on("enter_room", (roomName: string, done: Function) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("set_nickname", (nickname: string) => {
    socket.nickname = nickname;
  });

  socket.on("send_offer", (offer: RTCSessionDescriptionInit, roomName: string) => {
    socket.to(roomName).emit("receive_offer", offer);
  });

  socket.on("send_answer", (answer: RTCSessionDescriptionInit, roomName: string) => {
    socket.to(roomName).emit("receive_answer", answer);
  });

  socket.on("send_ice", (ice: RTCIceCandidate, roomName: string) => {
    socket.to(roomName).emit("receive_ice", ice);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
