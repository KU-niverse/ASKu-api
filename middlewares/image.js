const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {v4:uuidv4} = require("uuid");

const allowedExtention = ["jpg", "jpeg", "png", "gif"];
const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com/");
const region = "kr-standard";
dotenv.config();

// S3 객체 생성
const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

// multer image uploader, 5MB 제한, 사용할 때 imageUploader.single("image") 이런 식으로 미들웨어로 사용
exports.imageUploader = multer({
  storage: multerS3({
    s3: S3,
    bucket: "image-bucket",
    acl: "public-read",
    key: (req, file, cb) => {
      const uuid = uuidv4();
      const extension = file.originalname.split(".").pop();
      const fileName = `${uuid}.${extension}`;
      console.log(fileName);
      if(!allowedExtention.includes(extension)){
        return cb(new Error("Wrong extension"), false);
      }
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 크기 제한
  },
});