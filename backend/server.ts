import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const corsOptions = {
  origin: '*',
  credentials: true,
};

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

interface Room {
  id: string;
  name: string;
  isOpen: boolean;
}

interface User {
  id: string;
}

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use("/", express.static(`${process.cwd()}/../frontend/build`));
app.use(express.json());
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const rooms: Record<string, User[]> = {};

// 사전에 방 세 개 생성
function createRoom(name: string, roomId: string): Room {
  const room: Room = { id: roomId, name, isOpen: true };
  rooms[roomId] = [];
  return room;
}

createRoom("Chat Room 1", '0');
createRoom("Chat Room 2", '1');
createRoom("Chat Room 3", '2');

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

// 어떤 방에 어떤 유저가 들어있는지
let users: Record<string, User[]> = {};
// socket.id 기준으로 어떤 방에 들어있는지
let socketRoom: Record<string, string> = {};

// 방의 최대 인원수
const MAXIMUM = 2;

io.on("connection", (socket) => {
  console.log(socket.id, "connection");

  socket.on("join_room", (data: { room: string }) => {
    console.log('1');
    // 방이 기존에 생성되어 있다면
    if (users[data.room]) {
      console.log(data);
      // 현재 입장하려는 방에 있는 인원수
      const currentRoomLength = users[data.room].length;
      if (currentRoomLength === MAXIMUM) {
        // 인원수가 꽉 찼다면 돌아갑니다.
        socket.to(socket.id).emit("room_full");
        return;
      }

      // 여분의 자리가 있다면 해당 방 배열에 추가해줍니다.
      users[data.room] = [...users[data.room], { id: socket.id }];
    } else {
      // 방이 존재하지 않다면 값을 생성하고 추가해줍시다.
      users[data.room] = [{ id: socket.id }];
    }
    socketRoom[socket.id] = data.room;

    // 입장
    socket.join(data.room);

    // 입장하기 전 해당 방의 다른 유저들이 있는지 확인하고
    // 다른 유저가 있었다면 offer-answer을 위해 알려줍니다.
    const others = users[data.room].filter((user) => user.id !== socket.id);
    if (others.length) {
      io.sockets.to(socket.id).emit("all_users", others);
    }
  });

  socket.on("offer", (sdp: any, roomName: string) => {
    // offer를 전달받고 다른 유저들에게 전달해 줍니다.
    socket.to(roomName).emit("getOffer", sdp);
  });

  socket.on("answer", (sdp: any, roomName: string) => {
    // answer를 전달받고 방의 다른 유저들에게 전달해 줍니다.
    socket.to(roomName).emit("getAnswer", sdp);
  });

  socket.on("candidate", (candidate: any, roomName: string) => {
    // candidate를 전달받고 방의 다른 유저들에게 전달해 줍니다.
    socket.to(roomName).emit("getCandidate", candidate);
  });

  socket.on("disconnect", () => {
    // 방을 나가게 된다면 socketRoom과 users의 정보에서 해당 유저를 지워줍니다.
    const roomID = socketRoom[socket.id];

    if (users[roomID]) {
      users[roomID] = users[roomID].filter((user) => user.id !== socket.id);
      if (users[roomID].length === 0) {
        delete users[roomID];
        return;
      }
    }
    delete socketRoom[socket.id];
    socket.broadcast.to(roomID).emit("user_exit", { id: socket.id });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
