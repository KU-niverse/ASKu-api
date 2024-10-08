const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
/* const path = require("path"); */
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const hpp = require("hpp");
const redis = require("redis");
const RedisStore = require("connect-redis").default;

const userRouter = require("./routes/user");
const questionRoutes = require("./routes/question");
const debateRoutes = require("./routes/debate");
const notificationRoutes = require("./routes/notification");
const reportRoutes = require("./routes/report");
const admin = require("./routes/admin");
const searchRoutes = require("./routes/search");
const { stream } = require("./config/winston");

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
});
redisClient.on("connect", () => {
  console.info(`Redis connected`);
});
redisClient.on("error", (err) => {
  console.error(`Redis Client Error`, err);
});
redisClient.connect().then();

const wikiRoutes = require("./routes/wiki");
const passportConfig = require("./passport");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger_output.json");

const app = express();

passportConfig(); // 패스포트 설정

app.use(bodyParser.json());
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

let corsOptions = {
  origin: ["http://localhost:3000", "https://www.koreapas.com"],
  credentials: true,
};

if (process.env.NODE_ENV === "production") {
  corsOptions.origin = [process.env.ORIGIN_URL, "https://www.koreapas.com"];
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
  store: new RedisStore({ client: redisClient, prefix: "session: ", db: 0 }),
};
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

app.set("port", process.env.PORT || 3000);

/* 스웨거 코드  */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} http://localhost:3000/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

/* 스웨거 코드 */

app.use("/user", userRouter);
app.use("/question", questionRoutes);
app.use("/debate", debateRoutes);
app.use("/notification", notificationRoutes);
app.use("/report", reportRoutes);

app.use("/admin", admin);
app.use("/search", searchRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/wiki", wikiRoutes);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
