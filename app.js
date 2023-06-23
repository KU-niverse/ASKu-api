const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("port", 8080);

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), '번 포트에서 대기 중');
});