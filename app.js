const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const wikiRoutes = require("./routes/wiki");

const app = express();

app.set("port", 8080);

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/wiki", wikiRoutes);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), '번 포트에서 대기 중');
});