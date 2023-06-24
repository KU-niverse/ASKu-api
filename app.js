const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
/* const path = require("path"); */
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");

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
app.use(passport.sessoin());

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
