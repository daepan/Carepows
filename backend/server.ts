import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import sqlite from "better-sqlite3";
import { eq } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"; // eq 추가
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Lucia } from "lucia";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const sqliteDB = sqlite(process.env.SQLITE_DB_PATH || ":memory:");
const db = drizzle(sqliteDB);

const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  number: text("number"),
  describe: text("describe"),
  location: text("location"),
  diagnosisRecords: text("diagnosis_records").default('[]') // JSON 문자열로 진단 기록 저장
});

const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull()
});

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
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

// IMPORTANT!
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
  const { userId, password, name, number, describe, location } = req.body;
  try {
    const existingUser = await db.select().from(userTable).where(eq(userTable.userId, userId)).get();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(userTable).values({
      id: crypto.randomUUID(),
      userId,
      password: hashedPassword,
      name,
      number,
      describe,
      location,
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
    const user = await db.select().from(userTable).where(eq(userTable.userId, userId)).get();
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
    const user = await db.select().from(userTable).where(eq(userTable.id, id)).get();
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
    const user = await db.select().from(userTable).where(eq(userTable.id, id)).get();
    if (user) {
      const diagnosisRecords = JSON.parse(user.diagnosisRecords || '[]');
      diagnosisRecords.push(diagnosis);
      await db.update(userTable).set({ diagnosisRecords: JSON.stringify(diagnosisRecords) }).where(eq(userTable.id, user.id)).run();
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
    const user = await db.select().from(userTable).where(eq(userTable.id, id)).get();
    if (user) {
      let diagnosisRecords = JSON.parse(user.diagnosisRecords || '[]');
      diagnosisRecords = diagnosisRecords.filter((record: any) => record !== diagnosis);
      await db.update(userTable).set({ diagnosisRecords: JSON.stringify(diagnosisRecords) }).where(eq(userTable.id, user.id)).run();
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
