import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import Database from 'better-sqlite3';
import { eq } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Lucia } from "lucia";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const __dirname = import.meta.dirname;
const sqliteDB = new Database(process.env.SQLITE_DB_PATH ? path.join(__dirname, process.env.SQLITE_DB_PATH) : ":memory:?cache=shared",{
  fileMustExist: true
});
const db = drizzle(sqliteDB);

const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  number: text("number"),
  describe: text("describe"),
  location: text("location"),
  userType: text("user_type").notNull(),
  diagnosisRecords: text("diagnosis_records").default('[]')
});

const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull()
});

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, users);
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { userId, password, name, number, describe, location, userType } = req.body;
  try {
    const existingUser = await db.select().from(users).where(eq(users.userId, userId)).get();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      id: uuidv4(),
      userId,
      password: hashedPassword,
      name,
      number,
      describe,
      location,
      userType,
      diagnosisRecords: JSON.stringify([])
    }).run();
    res.status(201).json({
      success: true,
      message: '회원가입 성공!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '서버 오류로 인해 회원가입에 실패했습니다.',
    });
  }
});

app.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await db.select().from(users).where(eq(users.userId, userId)).get();
    if (user && await bcrypt.compare(password, user.password)) {
      const session = await lucia.createSession(user.id, {}, { sessionId: undefined });
      const { password, ...userInfo } = user;
      userInfo.diagnosisRecords = JSON.parse(userInfo.diagnosisRecords || '[]');
      res.json({
        success: true,
        message: '로그인 성공!',
        data: userInfo,
        session,
      });
    } else {
      res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 잘못되었습니다.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '서버 오류로 인해 로그인에 실패했습니다.',
    });
  }
});

app.get('/user/:id/diagnosis', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).get();
    if (user) {
      const diagnosisRecords = JSON.parse(user.diagnosisRecords || '[]');
      res.json({
        success: true,
        diagnosisRecords,
      });
    } else {
      res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '서버 오류로 인해 진단 기록을 가져올 수 없습니다.',
    });
  }
});

app.post('/user/:id/diagnosis', async (req, res) => {
  const { id } = req.params;
  const { diagnosis } = req.body;
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).get();
    if (user) {
      const diagnosisRecords = JSON.parse(user.diagnosisRecords || '[]');
      diagnosisRecords.push(diagnosis);
      await db.update(users).set({ diagnosisRecords: JSON.stringify(diagnosisRecords) }).where(eq(users.id, user.id)).run();
      res.json({
        success: true,
        message: '진단 기록이 추가되었습니다.',
        diagnosisRecords,
      });
    } else {
      res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '서버 오류로 인해 진단 기록을 추가할 수 없습니다.',
    });
  }
});

app.delete('/user/:id/diagnosis', async (req, res) => {
  const { id } = req.params;
  const { diagnosis } = req.body;
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).get();
    if (user) {
      let diagnosisRecords = JSON.parse(user.diagnosisRecords || '[]');
      diagnosisRecords = diagnosisRecords.filter((record: any) => record !== diagnosis);
      await db.update(users).set({ diagnosisRecords: JSON.stringify(diagnosisRecords) }).where(eq(users.id, user.id)).run();
      res.json({
        success: true,
        message: '진단 기록이 삭제되었습니다.',
        diagnosisRecords,
      });
    } else {
      res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '서버 오류로 인해 진단 기록을 삭제할 수 없습니다.',
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

// 초기 수의사 데이터 삽입
const insertInitialDoctors = async () => {
  const doctors = [
    {
      userId: "qw03011",
      password: await bcrypt.hash("1234", 10),
      name: "김대관",
      number: "042-472-8480",
      describe: "성실하게 임하겠습니다.",
      location: "대전패트릭동물병원",
      userType: "doctor",
      diagnosisRecords: JSON.stringify([])
    },
    {
      userId: "hy123",
      password: await bcrypt.hash("1234", 10),
      name: "김형진",
      number: "041-422-8610",
      describe: "잘 임하겠습니다.",
      location: "서울진사동물병원",
      userType: "doctor",
      diagnosisRecords: JSON.stringify([])
    },
    {
      userId: "ms123",
      password: await bcrypt.hash("1234", 10),
      name: "전민서",
      number: "02-725-8508",
      describe: "열심히 임하겠습니다.",
      location: "청주펫케어병원",
      userType: "doctor",
      diagnosisRecords: JSON.stringify([])
    }
  ];

  for (const doctor of doctors) {
    const existingUser = await db.select().from(users).where(eq(users.userId, doctor.userId)).get();
    if (!existingUser) {
      await db.insert(users).values({ id: uuidv4(), ...doctor }).run();
    }
  }
};

insertInitialDoctors();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
