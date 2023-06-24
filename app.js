const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const questionRoutes = require("./routes/question");

dotenv.config();

const app = express();

app.set("port", 8080);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.use("/question", questionRoutes);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), '번 포트에서 대기 중');
});