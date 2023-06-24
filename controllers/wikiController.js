// const Wiki_history = require("../models/wikiModel.js");
// const fs = require("fs");
// const Point = require("../models/pointModel.js");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {v4:uuidv4} = require("uuid");

const allowedExtention = ["jpg", "jpeg", "png", "gif"];
const endpoint = new AWS.Endpoint("https://kr.object.ncloudstorage.com/");
const region = "kr-standard";
dotenv.config();

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

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

// 버킷 리스트 가져오기
exports.bucketListGetMid = async (req, res) => {
  S3.listBuckets((err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    res.status(200).send(data);
  });
};

// 위키 파일 읽어오기
exports.wikiGetMid = async (req, res) => {
  const title = req.params.title.replace(/\/+/g, "_");
  const version = 1; // 수정 필요
  S3.getObject({
    Bucket: "wiki-bucket",
    Key: `${title}/r${version}.wiki`,
  }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const text = data.Body.toString('utf-8');
    console.log(text);
    res.status(200).send(text);
  });
};

// 위키 파일 업로드
exports.wikiPutMid = async (req, res) => {
  const title = req.params.title.replace(/\/+/g, "_");
  const text = req.body.text; 
  const version = 1; // 수정 필요
  S3.putObject({
    Bucket: "wiki-bucket",
    Key: `${title}/r${version}.wiki`,
    Body: text,
  }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    res.status(200).send(data);
  });
};

// //TODO: POST 요청에 사용자가 로그인 했는지 확인
// //TODO: 문서 수정시 사용자에게 보상 지급
// //TODO: 현재는 editor_id 받고 있는데, 백엔드에서 editor_id를 받아오는 방식 도입

// // 전체 글 불러오기 + 수정 시 기존 전체 텍스트 불러오기
// exports.contentsGetMid = async (req, res) => {
//     const rows = await Wiki_history.readRecent();
//     let jsonData = {};

//     // 가장 최근 버전의 파일 읽어서 jsonData에 저장
//     fs.readFile(
//         `./documents/${rows[0].text_pointer}.wiki`,
//         "utf8",
//         (err, data) => {
//             // 없는 파일 요청 시 에러 처리
//             if (err) {
//                 res.status(404).send({
//                     message: "File not found",
//                 });
//                 return;
//             }

//             // 원래 통으로 가져오는 코드
//             const lines = data.split(/\r?\n/);
//             const text = lines.join("\n");

//             jsonData["version"] = rows[0].text_pointer;
//             jsonData["text"] = text;

//             const sections = [];
//             let currentSection = null;
//             let currentContent = null;
//             const numbers = [];

//             // 파일 읽고 section 나누기
//             for (let line of lines) {
//                 const matches = line.match(/^(\={2,})\s+(.+?)\s+\1\s*$/); // 정규식 패턴에 맞는지 검사합니다.
//                 if (matches !== null) {
//                     // 해당 라인이 섹션 타이틀인 경우
//                     numbers.push(matches[1].length - 1);
//                     if (currentSection !== null) {
//                         currentSection.content.push(currentContent);
//                         sections.push(currentSection);
//                     }
//                     currentSection = {
//                         title: matches[2],
//                         content: [],
//                     };
//                     currentContent = "";
//                 } else {
//                     // 해당 라인이 섹션 내용인 경우
//                     if (currentContent !== "") {
//                         // 빈 줄이면
//                         currentContent += "\n";
//                     }
//                     currentContent += line;
//                 }
//             }

//             if (currentSection !== null) {
//                 // 마지막 섹션 push
//                 currentSection.content.push(currentContent);
//                 sections.push(currentSection);
//             }

//             let content_json = []; // content의 메타데이터와 데이터
//             let numList = []; // index의 리스트
//             let idx = 1; // 가장 상위 목차

//             // 인덱싱
//             for (let i = 0; i < numbers.length; i++) {
//                 let section_dic = {}; // section : section, index : index, title: title, content: content
//                 section_dic["section"] = (i + 1).toString();
//                 const num = numbers[i];

//                 if (num === 1) {
//                     // 가장 상위 목차가 변경됐을 경우
//                     numList = [idx++];
//                     section_dic["index"] = numList[0].toString();
//                 } else {
//                     if (num > numList.length) {
//                         // 하위 목차로 들어갈 때
//                         while (numList.length < num) numList.push(1);
//                     } else {
//                         while (numList.length > 0 && num < numList.length) {
//                             // depth가 똑같아질 때까지 pop
//                             numList.pop();
//                         }
//                         let tmp = numList[numList.length - 1]; // 한 단계 올리기
//                         numList.pop();
//                         numList.push(tmp + 1);
//                     }
//                     section_dic["index"] = numList.join(".");
//                 }

//                 // title과 content 저장
//                 section_dic["title"] = sections[i].title;
//                 let content_text = "";
//                 for (let content of sections[i].content) {
//                     content_text += content;
//                 }
//                 section_dic["content"] = content_text;

//                 content_json.push(section_dic);
//             }

//             jsonData["contents"] = content_json;
//             res.status(200).send(jsonData);
//         }
//     );
// };

// // 전체 글 수정하기
// exports.contentsPostMid = async (req, res) => {
//     // 빈 내용 요청 시 에러 처리
//     // if (req.body===undefined) {
//     //     res.status(400).send({
//     //         message: "Content can't be empty"
//     //     });
//     //     return;
//     // }

//     const rows = await Wiki_history.readRecent();
//     // 버전 불일치 시 에러 처리(누가 이미 수정했을 경우)
//     if (req.body.version != rows[0].text_pointer) {
//         res.status(426).send({
//             message: "Version is not matched",
//             newContent: req.body.newContent,
//         });
//         return;
//     }

//     // 전체 글 저장하는 새 파일(버전) 만들기
//     const latestVersion = parseInt(rows[0].text_pointer.substring(1));
//     const updatedFileName = `./documents/r${latestVersion + 1}.wiki`;
//     const newContent = req.body.newContent;

//     console.log("hihihihiidsaf");

//     fs.writeFile(updatedFileName, newContent, (err) => {
//         // 파일 쓰다가 에러난 경우
//         if (err) {
//             res.status(432).send({
//                 message: "Something went wrong while writing file",
//                 newContent: req.body.newContent,
//             });
//             return;
//         }
//         console.log("The file has been updated!");
//     });

//     // 새로운 히스토리 생성
//     const newWiki_history = new Wiki_history({
//         editor_id: req.user[0].user_id,
//         text_pointer: `r${latestVersion + 1}`,
//         is_rollback: 0,
//         //content_summary: req.body.content_summary
//     });

//     const rows_history = await Wiki_history.create(newWiki_history);

//     console.log(rows_history);

//     // point 주는 api 요청
//     try {
//         const reason = 5;
//         const point = 15000;
//         const user_id = req.user[0].user_id;
//         req.user_id = user_id;
//         req.reason = reason;
//         req.point = point;
//         const isWikiEdited = await Point.isWikiEdited(user_id);
//         console.log(isWikiEdited);
//         if (isWikiEdited >= 3) {
//             return res
//                 .status(210)
//                 .json({ success: true, message: "전체 글이 업데이트 됐고, 이미 당일 수정으로 인한 포인트를 모두 받았습니다." });
//         }
//         else if (isWikiEdited < 3) {
//             await Point.getPoint(user_id, reason, point);
//             return res
//                 .status(200)
//                 .json({ success: true, message: "전체 글이 업데이트 됐고, 15000 포인트가 지급되었습니다." });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(404).send({ message: "오류가 발생했습니다." });
//     }

//     // res.status(200).send({
//     //     message: "Successfully updated",
//     // });
// };

// // 수정 시 기존 섹션 텍스트 불러오기
// exports.contentsSectionGetMid = async (req, res) => {
//     const rows = await Wiki_history.readRecent();
//     let sections = [];

//     // 정규화로 섹션 분리
//     fs.readFile(
//         `./documents/${rows[0].text_pointer}.wiki`,
//         "utf8",
//         (err, contents) => {
//             // 없는 파일 요청 시 에러 처리
//             if (err) {
//                 res.status(404).send({
//                     message: "File not found",
//                 });
//                 return;
//             }

//             const lines = contents.split(/\r?\n/);
//             let currentSection = null;
//             let currentContent = null;

//             for (let line of lines) {
//                 const matches = line.match(/^(\={2,})\s+(.+?)\s+\1\s*$/); // 정규식 패턴에 맞는지 검사합니다.
//                 if (matches !== null) {
//                     // 해당 라인이 섹션 타이틀인 경우
//                     if (currentSection !== null) {
//                         currentSection.content.push(currentContent);
//                         sections.push(currentSection);
//                     }
//                     currentSection = {
//                         title: line,
//                         content: [],
//                     };
//                     currentContent = "";
//                 } else {
//                     // 해당 라인이 섹션 내용인 경우
//                     if (currentContent !== "") {
//                         currentContent += "\n";
//                     }
//                     currentContent += line;
//                 }
//             }

//             if (currentSection !== null) {
//                 currentSection.content.push(currentContent);
//                 sections.push(currentSection);
//             }

//             // 섹션 번호에 맞는 섹션 불러오기, 유효하지 않은 번호일 경우 에러 처리
//             try {
//                 section = sections[parseInt(req.params.section) - 1];
//                 //console.log(sections)
//                 jsonData = {};
//                 jsonData["version"] = rows[0].text_pointer;
//                 jsonData["title"] = section.title;
//                 jsonData["content"] = section.content.join("\n");
//                 res.status(200).send(jsonData);
//             } catch (err) {
//                 res.status(422).send({ error: "Invalid section number" });
//             }
//         }
//     );
// };

// // 섹션 수정하기
// exports.contentsSectionPostMid = async (req, res) => {
//     // 빈 내용 요청 시 에러 처리
//     // console.log(req.body);

//     // if (req.body===undefined) {
//     //     res.status(400).send({
//     //         message: "Content can't be empty"
//     //     });
//     //     return;
//     // }

//     const rows = await Wiki_history.readRecent();
//     // 버전 불일치 시 에러 처리(누가 이미 수정했을 경우)
//     if (req.body.version != rows[0].text_pointer) {
//         res.status(426).send({
//             message: "Version is not matched",
//             newContent: req.body.newContent,
//         });
//         return;
//     }

//     // 섹션 수정하고 새 파일(버전) 만들기
//     const index = req.params.section;
//     const readline = require("readline");

//     const latestVersion = parseInt(rows[0].text_pointer.substring(1));
//     const updatedFileName = `./documents/r${latestVersion + 1}.wiki`;
//     const fileName = `./documents/r${latestVersion}.wiki`;
//     const updatedSectionIndex = index - 1;
//     const newContent = req.body.newContent;

//     try {
//         const rl = readline.createInterface({
//             input: fs.createReadStream(fileName),
//             crlfDelay: Infinity,
//         });

//         let fileContent = "";
//         let currentSectionIndex = -1;

//         let flag = 0;

//         rl.on("line", (line) => {
//             if (/^(\={2,})\s+(.+?)\s+\1\s*$/.test(line)) {
//                 currentSectionIndex++;
//             }
//             if ((currentSectionIndex === updatedSectionIndex) & (flag === 0)) {
//                 fileContent += newContent + "\n";
//                 flag = 1;
//             } else if ((currentSectionIndex === updatedSectionIndex) & (flag === 1)) {
//             } else {
//                 fileContent += line + "\n";
//             }
//         }).on("close", () => {
//             fs.writeFile(updatedFileName, fileContent.replace(/\s+$/, ""), (err) => {
//                 // 파일 쓰다가 에러난 경우
//                 if (err) {
//                     res.status(432).send({
//                         message: "Something went wrong while writing file",
//                         newContent: req.body.newContent,
//                     });
//                     return;
//                 }
//                 console.log("The file has been updated!");
//             });
//         });

//         // 새로운 히스토리 생성
//         const newWiki_history = new Wiki_history({
//             editor_id: req.user[0].user_id,
//             text_pointer: `r${latestVersion + 1}`,
//             is_rollback: 0,
//             //content_summary: req.body.content_summary
//         });

//         const rows_history = await Wiki_history.create(newWiki_history);
//         console.log(rows_history);
//     } catch (err) {
//         res.status(432).send({
//             message: "Something went wrong while making history",
//             newContent: req.body.newContent,
//         });
//         return;
//     }

//     // point 주는 api 요청
//     try {
//         const reason = 5;
//         const point = 15000;
//         const user_id = req.user[0].user_id;
//         req.user_id = user_id;
//         req.reason = reason;
//         req.point = point;
//         const isWikiEdited = await Point.isWikiEdited(user_id);
//         console.log(isWikiEdited);
//         if (isWikiEdited >= 3) {
//             return res
//                 .status(210)
//                 .json({ success: true, message: "section이 업데이트 됐고, 이미 당일 수정으로 인한 포인트를 모두 받았습니다." });
//         }
//         else if (isWikiEdited < 3) {
//             await Point.getPoint(user_id, reason, point);
//             return res
//                 .status(200)
//                 .json({ success: true, message: "section이 업데이트 됐고, 15000 포인트가 지급되었습니다." });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(404).send({ message: "오류가 발생했습니다." });
//     }

//     // res.status(200).send({
//     //     message: "Section is updated successfully",
//     // });
// };

// // 수정 내역 불러오기
// exports.historyGetMid = async (req, res) => {
//     const rows = await Wiki_history.read();
//     res.status(200).send(rows);
// };

// // 각 수정 내역의 raw 파일 불러오기
// exports.historyVersionGetMid = async (req, res) => {
//     let jsonData = {};

//     // 해당 버전의 파일 읽어서 jsonData에 저장
//     fs.readFile(`./documents/${req.params.version}.wiki`, "utf8", (err, data) => {
//         // 없는 파일 요청 시 에러 처리
//         if (err) {
//             res.status(404).send({
//                 message: "File not found",
//             });
//             return;
//         }

//         const lines = data.split(/\r?\n/);
//         const text = lines.join("\n");

//         jsonData["version"] = req.params.version;
//         jsonData["text"] = text;
//         res.status(200).send(jsonData);
//     });
// };

// // 롤백하기
// exports.historyVersionPostMid = async (req, res) => {
//     const rows = await Wiki_history.readRecent();

//     // 전체 글 저장하는 새 파일(버전) 만들기
//     const latestVersion = parseInt(rows[0].text_pointer.substring(1));
//     const rollbackVersion = parseInt(req.params.version.substr(1));
//     const updatedFileName = `./documents/r${latestVersion + 1}.wiki`;
//     const originalFileName = `./documents/r${rollbackVersion}.wiki`;

//     try {
//         fs.copyFileSync(originalFileName, updatedFileName);
//         console.log("rollback success!");
//     } catch (err) {
//         // 파일 쓰다가 에러난 경우
//         res.status(432).send({
//             message: "Something went wrong while doing rollback",
//         });
//         return;
//     }

//     // 새로운 히스토리 생성
//     const newWiki_history = new Wiki_history({
//         editor_id: req.user[0].user_id,
//         text_pointer: `r${latestVersion + 1}`,
//         is_rollback: rollbackVersion,
//         //content_summary: req.body.content_summary
//     });

//     const rows_history = await Wiki_history.create(newWiki_history);
//     console.log(rows_history);

//     res.status(200).send({
//         message: "Rollback is success",
//     });
// };

// // 두 버전 비교하기
// exports.comparisonGetMid = async (req, res) => {
//     let rev = req.params.rev;
//     let oldrev = req.params.oldrev;
//     let jsonData = {};

//     try {
//         // 해당 버전의 파일 읽어서 jsonData에 저장
//         const data = fs.readFileSync(`./documents/${rev}.wiki`, "utf8");
//         const lines = data.split(/\r?\n/);
//         const text = lines.join("\n");

//         jsonData["rev"] = rev;
//         jsonData["rev_text"] = text;
//     } catch (err) {
//         // 없는 파일 요청 시 에러 처리
//         res.status(404).send({
//             message: "File not found",
//         });
//         return;
//     }

//     try {
//         // 해당 버전의 파일 읽어서 jsonData에 저장
//         const data = fs.readFileSync(`./documents/${oldrev}.wiki`, "utf8");
//         const lines = data.split(/\r?\n/);
//         const text = lines.join("\n");

//         jsonData["oldrev"] = oldrev;
//         jsonData["oldrev_text"] = text;
//     } catch (err) {
//         // 없는 파일 요청 시 에러 처리
//         res.status(404).send({
//             message: "File not found",
//         });
//         return;
//     }

//     oldrev = parseInt(oldrev.substring(1));
//     rev = parseInt(rev.substring(1));

//     if (oldrev >= rev) {
//         res.status(432).send({
//             message: "oldrev should be smaller than rev",
//         });
//         return;
//     }

//     res.status(200).send(jsonData);
// };