const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const debateRoutes = require("./routes/debate");

dotenv.config();

const app = express();

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

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.use("/debate", debateRoutes);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), '번 포트에서 대기 중');
});