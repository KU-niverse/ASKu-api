const Wiki = require("../models/wikiModel.js");
// const fs = require("fs");
// const Point = require("../models/pointModel.js");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");
const edp = "https://kr.object.ncloudstorage.com/";

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
      res.status(404).send(err);
      return;
    }
    const text = data.Body.toString('utf-8');
    console.log(text);
    res.status(200).send(text);
  });
};

// 위키 파일 업로드
exports.wikiPostMid = async (req, res) => {
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

// 새 위키 문서 생성하기 [기여도 지급]
// 1. 기존에 같은 타이틀의 문서가 있는지 체크
// 2-1. 없으면 새로운 문서 생성
// 2-2. 있으면 지워진 문서인지 확인
// 3-1. 지워진 문서면 처리
// 3-2. 지워진 문서가 아니면 에러 처리(중복 알림)
exports.newWikiPostMid = async (req, res, next) => {
  try {
    // 1. 기존에 같은 타이틀의 문서가 있는지 체크
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);

    if (doc_id !== null) {
      // 2-2. 있으면 지워진 문서인지 확인
      const row = await Wiki.Wiki_docs.getWikiDocsById(doc_id);
      if (row.is_deleted === 1) {
        // 3-1. 지워진 문서면 처리
      }
      else {
        // 3-2. 지워진 문서가 아니면 에러 처리(중복 알림)
        res.status(409).send({
          message: "Already exist",
        });
        return;
      }
    }

    const title = req.params.title.replace(/\/+/g, "_");
    const text = req.body.text;
    const version = 1;
    const type = req.body.type;

    // 2-1. 없으면 새로운 문서 생성
    let count = 0;
    // 아래는 S3에 저장하는 코드
    S3.putObject({
      Bucket: "wiki-bucket",
      Key: `${title}/r${version}.wiki`,
      Body: text,
    }, async (err) => {
      if (err) {
        console.log(err);
        return;
      }
      count = text.length;

      // 아래는 DB에 저장하는 코드
      const new_wiki_docs = new Wiki.Wiki_docs({
        title: req.params.title,
        text_pointer: `${edp}/wiki-bucket/${title}/r${version}.wiki`,
        type: type,
        latest_ver: version,
      });

      const rows_docs = await Wiki.Wiki_docs.create(new_wiki_docs);
      console.log(rows_docs);

      req.rows_docs = rows_docs;
      req.version = version;
      req.count = count;
      req.summary = "새 위키 문서 생성";
      req.text_pointer = `${edp}wiki-bucket/${title}/r${version}.wiki`;
      req.diff = count;

      // 히스토리 생성 -> 기여도 -> 알림
      next();
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 생성 중 오류" });
  }
};

// 전체 글 불러오기 + 수정 시 기존 전체 텍스트 불러오기
exports.contentsGetMid = async (req, res) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const title = req.params.title.replace(/\/+/g, "_");
    const version = rows[0].version;
    let text = "";
    let jsonData = {};

    // 가장 최근 버전의 파일 읽어서 jsonData에 저장
    S3.getObject({
      Bucket: "wiki-bucket",
      Key: `${title}/r${version}.wiki`,
    }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
        return;
      }
      text = data.Body.toString('utf-8');

      // 원래 통으로 가져오는 코드
      const lines = text.split(/\r?\n/);
      text = lines.join("\n");

      jsonData["version"] = version;
      jsonData["text"] = text;

      const sections = [];
      let current_section = null;
      let current_content = null;
      const numbers = [];

      // 파일 읽고 section 나누기
      for (let line of lines) {
        const matches = line.match(/^(={2,})\s+(.+?)\s+\1\s*$/); // 정규식 패턴에 맞는지 검사합니다.
        if (matches !== null) {
          // 해당 라인이 섹션 타이틀인 경우
          numbers.push(matches[1].length - 1);
          if (current_section !== null) {
            current_section.content.push(current_content);
            sections.push(current_section);
          }
          current_section = {
            title: matches[2],
            content: [],
          };
          current_content = "";
        } else {
          // 해당 라인이 섹션 내용인 경우
          if (current_content !== "") {
            // 빈 줄이면
            current_content += "\n";
          }
          current_content += line;
        }
      }

      if (current_section !== null) {
        // 마지막 섹션 push
        current_section.content.push(current_content);
        sections.push(current_section);
      }

      let content_json = []; // content의 메타데이터와 데이터
      let num_list = []; // index의 리스트
      let idx = 1; // 가장 상위 목차

      // 인덱싱
      for (let i = 0; i < numbers.length; i++) {
        let section_dic = {}; // section : section, index : index, title: title, content: content
        section_dic["section"] = (i + 1).toString();
        const num = numbers[i];

        if (num === 1) {
          // 가장 상위 목차가 변경됐을 경우
          num_list = [idx++];
          section_dic["index"] = num_list[0].toString();
        } else {
          if (num > num_list.length) {
            // 하위 목차로 들어갈 때
            while (num_list.length < num) num_list.push(1);
          } else {
            while (num_list.length > 0 && num < num_list.length) {
              // depth가 똑같아질 때까지 pop
              num_list.pop();
            }
            let tmp = num_list[num_list.length - 1]; // 한 단계 올리기
            num_list.pop();
            num_list.push(tmp + 1);
          }
          section_dic["index"] = num_list.join(".");
        }

        // title과 content 저장
        section_dic["title"] = sections[i].title;
        let content_text = "";
        for (let content of sections[i].content) {
          content_text += content;
        }
        section_dic["content"] = content_text;

        content_json.push(section_dic);
      }

      jsonData["contents"] = content_json;
      res.status(200).send(jsonData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 불러오기 중 오류" });
  }
};

// 전체 글 수정하기
exports.contentsPostMid = async (req, res, next) => {
  try {
    // 빈 내용 요청 시 에러 처리
    // if (req.body===undefined) {
    //     res.status(400).send({
    //         message: "Content can't be empty"
    //     });
    //     return;
    // }

    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const version = rows[0].version;

    // 버전 불일치 시 에러 처리(누가 이미 수정했을 경우)
    if (req.body.version != version) {
      res.status(426).send({
        message: "Version is not matched",
        new_content: req.body.new_content,
      });
      return;
    }

    // 전체 글 저장하는 새 파일(버전) 만들기
    const title = req.params.title.replace(/\/+/g, "_");
    const new_content = req.body.new_content;
    const new_version = version + 1; // 수정 필요

    S3.putObject({
      Bucket: "wiki-bucket",
      Key: `${title}/r${new_version}.wiki`,
      Body: new_content,
    }, async (err) => {
      if (err) {
        res.status(432).send({
          message: "Something went wrong while writing file",
          new_content: new_content,
        });
        return;
      }
      console.log("The file has been updated!");

      req.doc_id = doc_id;
      req.text_pointer = `${edp}wiki-bucket/${title}/r${new_version}.wiki`;
      req.summary = req.body.summary;
      req.count = new_content.length;
      req.diff = new_content.length - rows[0].count;
      req.version = new_version;

      // 히스토리 생성 -> 기여도 -> 알림
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 수정 중 오류" });
  }
};

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
//             let current_section = null;
//             let current_content = null;

//             for (let line of lines) {
//                 const matches = line.match(/^(\={2,})\s+(.+?)\s+\1\s*$/); // 정규식 패턴에 맞는지 검사합니다.
//                 if (matches !== null) {
//                     // 해당 라인이 섹션 타이틀인 경우
//                     if (current_section !== null) {
//                         current_section.content.push(current_content);
//                         sections.push(current_section);
//                     }
//                     current_section = {
//                         title: line,
//                         content: [],
//                     };
//                     current_content = "";
//                 } else {
//                     // 해당 라인이 섹션 내용인 경우
//                     if (current_content !== "") {
//                         current_content += "\n";
//                     }
//                     current_content += line;
//                 }
//             }

//             if (current_section !== null) {
//                 current_section.content.push(current_content);
//                 sections.push(current_section);
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
//             new_content: req.body.new_content,
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
//     const new_content = req.body.new_content;

//     try {
//         const rl = readline.createInterface({
//             input: fs.createReadStream(fileName),
//             crlfDelay: Infinity,
//         });

//         let fileContent = "";
//         let current_sectionIndex = -1;

//         let flag = 0;

//         rl.on("line", (line) => {
//             if (/^(\={2,})\s+(.+?)\s+\1\s*$/.test(line)) {
//                 current_sectionIndex++;
//             }
//             if ((current_sectionIndex === updatedSectionIndex) & (flag === 0)) {
//                 fileContent += new_content + "\n";
//                 flag = 1;
//             } else if ((current_sectionIndex === updatedSectionIndex) & (flag === 1)) {
//             } else {
//                 fileContent += line + "\n";
//             }
//         }).on("close", () => {
//             fs.writeFile(updatedFileName, fileContent.replace(/\s+$/, ""), (err) => {
//                 // 파일 쓰다가 에러난 경우
//                 if (err) {
//                     res.status(432).send({
//                         message: "Something went wrong while writing file",
//                         new_content: req.body.new_content,
//                     });
//                     return;
//                 }
//                 console.log("The file has been updated!");
//             });
//         });

//         // 새로운 히스토리 생성
//         const new_wiki_history = new Wiki_history({
//             editor_id: req.user[0].user_id,
//             text_pointer: `r${latestVersion + 1}`,
//             is_rollback: 0,
//             //content_summary: req.body.content_summary
//         });

//         const rows_history = await Wiki_history.create(new_wiki_history);
//         console.log(rows_history);
//     } catch (err) {
//         res.status(432).send({
//             message: "Something went wrong while making history",
//             new_content: req.body.new_content,
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
//     const new_wiki_history = new Wiki_history({
//         editor_id: req.user[0].user_id,
//         text_pointer: `r${latestVersion + 1}`,
//         is_rollback: rollbackVersion,
//         //content_summary: req.body.content_summary
//     });

//     const rows_history = await Wiki_history.create(new_wiki_history);
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