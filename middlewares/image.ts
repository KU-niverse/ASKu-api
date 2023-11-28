import * as dotenv from "dotenv";
import * as AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";

const allowedExtension = ["jpg", "jpeg", "png", "gif"];
const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com/");
const region = "kr-standard";

dotenv.config();

// S3 객체 생성
const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: process.env.ACCESSKEY!.toString(),
    secretAccessKey: process.env.SECRETACCESSKEY!.toString(),
  },
});

// multer image uploader, 5MB 제한, 사용할 때 imageUploader.single("image") 이런 식으로 미들웨어로 사용
export const imageUploader = multer({
  storage: multerS3({
    s3: S3 as any,
    bucket: "image-bucket",
    acl: "public-read",
    key: (req, file, cb) => {
      const uuid = uuidv4();
      const extension = file.originalname.split(".").pop();
      if (extension === undefined) {
        return cb(new Error("Invalid file extension"), "");
      }
      const fileName = `${uuid}.${extension}`;
      console.log(fileName);
      if (!allowedExtension.includes(extension)) {
        return cb(new Error("Wrong extension"), "");
      }
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 크기 제한
  },
});