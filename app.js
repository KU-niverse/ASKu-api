const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
/* const path = require("path"); */
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const userRouter = require("./routes/user");
dotenv.config();

const passportConfig = require("./passport");

const app = express();
passportConfig(); // 패스포트 설정

app.use(morgan("dev"));
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
};

app.use(session(sessionOption));
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;
}

app.use(passport.initialize());
app.use(passport.session());

app.set("port", process.env.PORT || 3000);

/* 스웨거 코드  */

const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
