import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';
import hpp from 'hpp';
import redis from 'redis';
import RedisStore from 'connect-redis';
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger_output.json";
import * as winston from "./config/winston";

// 라우트 import
import userRoutes from "./routes/user";
import questionRoutes from "./routes/question";
import debateRoutes from "./routes/debate";
import notificationRoutes from "./routes/notification";
import reportRoutes from "./routes/report";
import searchRoutes from "./routes/search";
import wikiRoutes from "./routes/wiki";
import adminRoutes from "./routes/admin";

// 환경 변수 로드
dotenv.config();

if (!process.env.COOKIE_SECRET || !process.env.ORIGIN_URL) {
  throw new Error("환경변수 COOKIE_SECRET 또는 ORIGIN_URL가 정의되어 있지 않습니다.");
}

// redis 연결
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`
});
redisClient.on("connect", () => {
  console.info(`Redis connected`);
});
redisClient.on("error", (err) => {
  console.error(`Redis Client Error`, err);
});
redisClient.connect().then();

// 앱 인스턴스 생성
const app = express();

// 로깅 설정
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", {stream: winston.stream}));
} else {
  app.use(morgan("dev"));
}

// 데이터 처리 미들웨어 설정
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 보안 미들웨어 설정
let corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
if (process.env.NODE_ENV === "production") {
  corsOptions.origin = process.env.ORIGIN_URL;
}

app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
if (process.env.NODE_ENV === "production") {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }));
  app.use(hpp());
}

// 세션 설정
const sessionOption: any = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
  store: new RedisStore({ client: redisClient, prefix: "session: "}),
  proxy: false,
};
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

// 패스포트 설정
passport.passportConfig();
app.use(passport.initialize());
app.use(passport.session());

// API 문서화
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

// 라우트 정의
app.use("/user", userRoutes);
app.use("/question", questionRoutes);
app.use("/debate", debateRoutes);
app.use("/notification", notificationRoutes);
app.use("/report", reportRoutes);
app.use("/admin", adminRoutes);
app.use("/search", searchRoutes);
app.use("/wiki", wikiRoutes);

// 서버 실행
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
