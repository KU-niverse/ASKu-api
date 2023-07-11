const swaggerAutogen = require("swagger-autogen")({openapi: "3.0.0"});

const options = {
  info: {
    title: "ASKu-api Docs",
    description: "ASKu의 api 문서입니다."
  },
  servers: [
    {
      url: "http://localhost:8080",
    },
  ],
  schemes: ["http"]
};

const outputFile = "./swagger_output.json";
const endpointFiles = ["./app.js"];
swaggerAutogen(outputFile, endpointFiles, options);