const Wiki = require("../models/wikiModel.js");
const Question = require("../models/questionModel.js");
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

// 이전 위키의 내용을 가져오는 함수
const getWikiContent = (res, title, version) => {
  const replaced_title = title.replace(/\/+/g, "_");
  return new Promise((resolve) => {
    S3.getObject(
      {
        Bucket: "wiki-bucket",
        Key: `${replaced_title}/r${version}.wiki`,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(404).send({
            // 내부에서 404 에러 처리
            success: false,
            message: err,
          });
          return;
        }
        resolve(data.Body.toString("utf-8"));
      }
    );
  });
};

exports.getWikiContent = getWikiContent;

// 새 위키 파일을 저장하는 함수
const saveWikiContent = (res, title, version, content) => {
  return new Promise((resolve, reject) => {
    S3.putObject(
      {
        Bucket: "wiki-bucket",
        Key: `${title}/r${version}.wiki`,
        Body: content,
      },
      (err) => {
        if (err) {
          console.log(err);
          err.content = content; // content 정보를 에러 객체에 추가
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

// 인덱싱 함수
const indexing = (numbers, sections) => {
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

  return content_json;
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
      } else {
        // 3-2. 지워진 문서가 아니면 에러 처리(중복 알림)
        res.status(409).send({
          success: false,
          message: "Already exist",
          content: req.body.text,
        });
        return;
      }
    }

    const title = req.params.title.replace(/\/+/g, "_");
    const text = req.body.text;
    const version = 1;
    const type = req.body.type;

    // 2-1. 없으면 새로운 문서 생성
    // 아래는 S3에 저장하는 코드
    await saveWikiContent(res, title, version, text);

    // 아래는 DB에 저장하는 코드
    const new_wiki_docs = new Wiki.Wiki_docs({
      title: req.params.title,
      text_pointer: `${edp}/wiki-bucket/${title}/r${version}.wiki`,
      recent_filtered_content: text,
      type: type,
      latest_ver: version,
      is_managed: 0,
    });

    const rows_docs = await Wiki.Wiki_docs.create(new_wiki_docs);
    console.log(rows_docs);

    let count = text.length;

    req.doc_id = rows_docs.id;
    req.version = version;
    req.count = count;
    req.summary = "새 위키 문서 생성";
    req.text_pointer = `${edp}wiki-bucket/${title}/r${version}.wiki`;
    req.diff = count;

    // 히스토리 생성 -> 기여도 -> 알림
    // 알림 변수 선언
    req.body.types_and_conditions = [[6, -1]];

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "위키 생성 중 오류",
      content: req.body.text,
    });
  }
};

// 전체 글 불러오기 + 수정 시 기존 전체 텍스트 불러오기
exports.contentsGetMid = async (req, res) => {
  try {
    const doc = await Wiki.Wiki_docs.getWikiDocsByTitle(req.params.title);
    const doc_id = doc.id;
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const title = req.params.title.replace(/\/+/g, "_");

    // 로그인 시에만, 조회수 증가

    if (req.isAuthenticated()) {
      const wiki_docs_view = new Wiki.Wiki_docs_view({
        doc_id: doc_id,
        user_id: req.user[0].id,
      });
      await wiki_docs_view.create();
    }

    if (rows.length === 0) {
      res
        .status(404)
        .send({ success: false, message: "존재하지 않는 문서입니다." });
      return;
    }

    let version;
    if (req.calltype === 1) {
      // 글 불러오거나 수정용
      version = rows[0].version;
    } else if (req.calltype === 2) {
      // 버전별 글 불러오기용
      version = req.params.version;
    }

    let text = "";
    let jsonData = {};
    jsonData["is_managed"] = doc.is_managed;

    // 삭제된 문서인지 확인
    const row = await Wiki.Wiki_docs.getWikiDocsById(doc_id);
    if (row.is_deleted === 1) {
      res.status(410).send({
        success: false,
        message: "삭제된 문서입니다.",
      });
      return;
    }

    // 가장 최근 버전의 파일 읽어서 jsonData에 저장
    // S3에서 파일 읽어오는 코드
    text = await getWikiContent(res, title, version);

    // 원래 통으로 가져오는 코드
    const lines = text.split(/\r?\n/);
    text = lines.join("\n");

    jsonData["version"] = version;
    jsonData["text"] = text;
    jsonData["contents"] = [];

    const sections = [];
    let current_section = null;
    let current_content = "";
    let is_started = false;
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
        } else {
          // 목차 없이 그냥 글만 있는 경우
          is_started = true;
          if (current_content.trim() !== "") {
            jsonData.contents.push({
              section: "0",
              index: "0",
              title: "들어가며",
              content: current_content,
            });
          }
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
    } else if (current_content !== null && !is_started) {
      // 목차가 아예 없는 경우
      jsonData.contents.push({
        section: "0",
        index: "0",
        title: "들어가며",
        content: current_content,
      });
    }

    indexing(numbers, sections).forEach((obj) => {
      jsonData.contents.push(obj);
    });

    jsonData["success"] = true;
    if (req.isAuthenticated()) {
      const rows = await Wiki.Wiki_favorite.getWikiFavoriteByUserIdAndDocId(
        req.user[0].id,
        doc_id
      );
      if (rows.length === 0) {
        jsonData["is_favorite"] = false;
      } else {
        jsonData["is_favorite"] = true;
      }
    } else {
      jsonData["is_favorite"] = false;
    }
    res.status(200).send(jsonData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "위키 불러오기 중 오류" });
  }
};

// 전체 글 수정하기
exports.contentsPostMid = async (req, res, next) => {
  try {
    // const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const doc = await Wiki.Wiki_docs.getWikiDocsByTitle(req.params.title);
    const doc_id = doc.id;
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const version = rows[0].version;

    if (doc.is_managed === 1) {
      if (req.user[0].is_authorized !== 1) {
        res.status(403).send({
          success: false,
          message: "인증된 회원만 편집이 가능한 문서입니다.",
          new_content: req.body.new_content,
        });
        return;
      }
    }

    // 버전 불일치 시 에러 처리(누가 이미 수정했을 경우)
    if (req.body.version != version) {
      res.status(426).send({
        success: false,
        message: "Version is not matched",
        new_content: req.body.new_content,
      });
      return;
    }

    // 전체 글 저장하는 새 파일(버전) 만들기
    const title = req.params.title.replace(/\/+/g, "_");
    const new_content = req.body.new_content;
    const new_version = version + 1;

    await saveWikiContent(res, title, new_version, new_content);

    req.doc_id = doc_id;
    req.text_pointer = `${edp}wiki-bucket/${title}/r${new_version}.wiki`;
    req.summary = req.body.summary;
    req.count = new_content.length;
    req.diff = new_content.length - rows[0].count;
    req.version = new_version;

    // 히스토리 생성 -> 기여도 -> 알림
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "위키 수정 중 오류",
      new_content: req.body.new_content,
    });
  }
};

// 수정 시 기존 섹션 텍스트 불러오기
// req에 doc_id, section 필요
exports.contentsSectionGetMid = async (req, res) => {
  try {
    // const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const doc = await Wiki.Wiki_docs.getWikiDocsByTitle(req.params.title);
    const doc_id = doc.id;
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const title = req.params.title.replace(/\/+/g, "_");
    const version = rows[0].version;
    let text = "";
    let sections = [];
    let jsonData = {};
    let section = null;

    // S3에서 파일 읽어오는 코드
    text = await getWikiContent(res, title, version);

    // 정규화로 섹션 분리
    const lines = text.split(/\r?\n/);
    let current_section = null;
    let current_content = null;

    for (let line of lines) {
      const matches = line.match(/^(={2,})\s+(.+?)\s+\1\s*$/); // 정규식 패턴에 맞는지 검사합니다.
      if (matches !== null) {
        // 해당 라인이 섹션 타이틀인 경우
        if (current_section !== null) {
          current_section.content.push(current_content);
          sections.push(current_section);
        }
        current_section = {
          title: line,
          content: [],
        };
        current_content = "";
      } else {
        // 해당 라인이 섹션 내용인 경우
        if (current_content !== "") {
          current_content += "\n";
        }
        current_content += line;
      }
    }

    if (current_section !== null) {
      current_section.content.push(current_content);
      sections.push(current_section);
    }

    // 섹션 번호에 맞는 섹션 불러오기
    section = sections[parseInt(req.params.section) - 1];
    jsonData = {};
    jsonData["doc_id"] = doc_id;
    jsonData["version"] = version;
    jsonData["title"] = section.title;
    jsonData["content"] = section.content.join("\n");
    jsonData["is_managed"] = doc.is_managed;
    jsonData["success"] = true;
    res.status(200).send(jsonData);
  } catch (err) {
    console.error(err);
    res.status(422).send({ success: false, message: "Invalid section number" });
  }
};

// 섹션 수정하기
exports.contentsSectionPostMid = async (req, res, next) => {
  try {
    // const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const doc = await Wiki.Wiki_docs.getWikiDocsByTitle(req.params.title);
    const doc_id = doc.id;
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);

    if (doc.is_managed === 1) {
      if (req.user[0].is_authorized !== 1) {
        res.status(403).send({
          success: false,
          message: "인증된 회원만 편집이 가능한 문서입니다.",
          new_content: req.body.new_content,
        });
        return;
      }
    }
    // 버전 불일치 시 에러 처리(누가 이미 수정했을 경우)
    if (req.body.version != rows[0].version) {
      res.status(426).send({
        success: false,
        message: "Version is not matched",
        new_content: req.body.new_content,
      });
      return;
    }

    // 섹션 수정하고 새 위키 파일(버전) 만들기
    const title = req.params.title.replace(/\/+/g, "_");
    const latest_ver = rows[0].version;
    const new_version = latest_ver + 1;
    const updated_section_index = req.params.section - 1;
    const new_content = req.body.new_content;

    // 이전 파일의 내용에서 일부 섹션을 다른 내용으로 대체하는 함수
    const updateFileContent = async () => {
      try {
        const fileContent = await getWikiContent(res, title, latest_ver);
        const lines = fileContent.split(/\r?\n/);

        let updated_content = "";
        let current_sectionIndex = -1;
        let flag = 0;

        lines.forEach((line) => {
          if (/^(={2,})\s+(.+?)\s+\1\s*$/.test(line)) {
            current_sectionIndex++;
          }
          if (current_sectionIndex === updated_section_index && flag === 0) {
            updated_content += new_content + "\n";
            flag = 1;
          } else if (
            (current_sectionIndex === updated_section_index) &
            (flag === 1)
          ) {
            void 0; // 아무것도 안함 섹션 내용을 아예 갈아끼운 것
          } else {
            updated_content += line + "\n";
          }
        });

        updated_content = updated_content.replace(/\s+$/, "");
        await saveWikiContent(res, title, new_version, updated_content);

        console.log("The file has been updated!");

        req.doc_id = doc_id;
        req.text_pointer = `${edp}wiki-bucket/${title}/r${new_version}.wiki`;
        req.summary = req.body.summary;
        req.count = updated_content.length;
        req.diff = updated_content.length - rows[0].count;
        req.version = new_version;

        // 히스토리 생성 -> 기여도 -> 알림
        next();
      } catch (error) {
        res.status(432).send({
          success: false,
          message: "섹션 수정 중 오류",
          new_content: new_content,
        });
      }
    };

    // 파일 내용 업데이트 실행
    updateFileContent();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "섹션 수정 중 오류",
      new_content: req.body.new_content,
    });
  }
};

// 모든 글 제목 조회
exports.titlesGetMid = async (req, res) => {
  try {
    const rows = await Wiki.Wiki_docs.getAllWikiDocs();
    res.status(200).send({ success: true, titles: rows });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 제목 불러오기 중 오류" });
  }
};

// 랜덤 글 제목 조회
exports.randomTitleGetMid = async (req, res) => {
  try {
    const title = await Wiki.Wiki_docs.getRandomWikiDocs();
    res.status(200).send({ success: true, title: title });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 제목 불러오기 중 오류" });
  }
};

// 위키 히스토리 불러오기
exports.historyGetMid = async (req, res) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const rows = await Wiki.Wiki_history.getWikiHistorysById(doc_id);
    res.status(200).send({ success: true, historys: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 히스토리 불러오기 중 오류" });
  }
};

// 최근 변경된 위키 히스토리 불러오기
exports.recentHistoryGetMid = async (req, res) => {
  try {
    const type = req.query.type ? req.query.type : "";
    const rows = await Wiki.Wiki_history.getRecentWikiHistorys(type);
    res.status(200).send({ success: true, message: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 히스토리 불러오기 중 오류" });
  }
};

// 특정 위키 히스토리의 raw 파일 불러오기
exports.historyRawGetMid = async (req, res) => {
  let jsonData = {};

  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const title = req.params.title.replace(/\/+/g, "_");
    const version = req.params.version;
    let text = "";

    // 해당 버전의 파일 읽어서 jsonData에 저장
    text = await getWikiContent(res, title, version);

    // 원래 통으로 가져오는 코드
    const lines = text.split(/\r?\n/);
    text = lines.join("\n");

    jsonData["doc_id"] = doc_id;
    jsonData["version"] = version;
    jsonData["text"] = text;
    res.status(200).send({ success: true, jsonData });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 raw data 불러오기 중 오류" });
  }
};

// 롤백하기
exports.historyVersionPostMid = async (req, res, next) => {
  try {
    // const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const doc = await Wiki.Wiki_docs.getWikiDocsByTitle(req.params.title);
    const doc_id = doc.id;
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const version = rows[0].version;

    if (doc.is_managed === 1) {
      if (req.user[0].is_authorized !== 1) {
        res.status(403).send({
          success: false,
          message: "인증된 회원만 롤백이 가능한 문서입니다.",
          new_content: req.body.new_content,
        });
        return;
      }
    }

    // 전체 글 저장하는 새 파일(버전) 만들기
    const title = req.params.title.replace(/\/+/g, "_");
    const new_version = version + 1;
    const rollback_version = parseInt(req.params.version);
    let text = "";

    text = await getWikiContent(res, title, rollback_version);

    // 원래 통으로 가져오는 코드
    const lines = text.split(/\r?\n/);
    text = lines.join("\n");

    // 새 파일 만들기
    await saveWikiContent(res, title, new_version, text);

    req.doc_id = doc_id;
    req.text_pointer = `${edp}wiki-bucket/${title}/r${new_version}.wiki`;
    req.summary = `version ${rollback_version}으로 롤백`;
    req.count = text.length;
    req.diff = text.length - rows[0].count;
    req.version = new_version;
    req.is_rollback = 1;
    req.body.index_title = rows[0].index_title;

    // 히스토리 생성 -> 알림
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "롤백 중 오류" });
  }
};

// 두 버전 비교하기
exports.comparisonGetMid = async (req, res) => {
  try {
    const title = req.params.title.replace(/\/+/g, "_");
    const rev = req.params.rev;
    const oldrev = req.params.oldrev;
    let jsonData = {};
    let text = "";
    let lines = [];

    if (oldrev <= 0) {
      res.status(400).send({
        success: false,
        message: "잘못된 요청입니다.",
      });
      return;
    }

    if (oldrev >= rev) {
      res.status(432).send({
        success: false,
        message: "oldrev should be smaller than rev",
      });
      return;
    }

    // rev 버전의 파일 읽어서 jsonData에 저장
    text = await getWikiContent(res, title, rev);
    lines = text.split(/\r?\n/);
    text = lines.join("\n");

    jsonData["rev"] = rev;
    jsonData["rev_text"] = text;

    // oldrev 버전의 파일 읽어서 jsonData에 저장
    text = await getWikiContent(res, title, oldrev);
    lines = text.split(/\r?\n/);
    text = lines.join("\n");

    jsonData["oldrev"] = oldrev;
    jsonData["oldrev_text"] = text;

    res.status(200).send({ success: true, jsonData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "두 버전 비교 중 오류" });
  }
};

// 문서 삭제하기
exports.wikiDeleteMid = async (req, res) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    await Wiki.Wiki_docs.deleteWikiDocsById(doc_id);
    res.status(200).json({ success: true, message: "위키 문서 삭제 성공" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "위키 문서 삭제 중 오류" });
  }
};

// 위키 제목 기반으로 문서 검색하기
exports.wikiSearchGetMid = async (req, res) => {
  try {
    let title = decodeURIComponent(req.params.title);
    if (title.includes("%") || title.includes("_")) {
      title = title.replace(/%/g, "\\%").replace(/_/g, "\\_");
    }
    if (!title) {
      res.status(400).send({ success: false, message: "잘못된 검색어" });
    } else {
      const user_id =
        req.user && req.user[0] && req.user[0].id ? req.user[0].id : 0;
      const rows = await Wiki.Wiki_docs.searchWikiDocsByTitle(title, user_id);
      res.status(200).send({ success: true, message: rows });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "위키 검색 중 오류" });
  }
};

// 같은 목차가 존재하는지 확인, ex) based_on_section: true, section: 3
exports.contentsSectionGetMidByIndex = async (req, res) => {
  try {
    // 질문을 받아온다
    const q = await Question.getQuestion(req.params.qid);
    // 질문에 해당하는 문서를 가져와서 목차를 가져온다
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(q.doc_id);
    const wiki_docs = await Wiki.Wiki_docs.getWikiDocsById(q.doc_id);
    const title = wiki_docs.title.replace(/\/+/g, "_");
    const version = rows[0].version;
    let text = "";
    let jsonData = {};

    // S3에서 파일 읽어오는 코드
    text = await getWikiContent(res, title, version);

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

    const content_json = indexing(numbers, sections);
    jsonData["contents"] = content_json;

    let index_title_list = [];
    for (let i = 0; i < content_json.length; i++) {
      index_title_list.push(
        content_json[i].index + " " + content_json[i].title
      );
    }

    const found = index_title_list.includes(q.index_title);

    // 목차를 순회하면서 질문과 같은 목차가 있는지 확인한다
    // 같은 목차가 있으면 res에 based_on_section: true, section: section을 넣어서 보낸다
    if (found) {
      jsonData["based_on_section"] = true;
      const section = index_title_list.indexOf(q.index_title) + 1;
      jsonData["section"] = section;
    }
    // 같은 목차가 없으면 res에 based_on_section: false를 넣어서 보낸다
    else {
      jsonData["based_on_section"] = false;
    }
    jsonData["success"] = true;

    res.status(200).send(jsonData);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 목차 불러오기 중 오류" });
  }
};

// 위키 즐겨찾기 조회
exports.wikiFavoriteGetMid = async (req, res) => {
  try {
    const rows = await Wiki.Wiki_favorite.getWikiFavoriteByUserId(
      req.user[0].id
    );
    res.status(200).send({ success: true, message: rows });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 즐겨찾기 조회 중 오류" });
  }
};

// 위키 즐겨찾기 추가
exports.wikiFavoritePostMid = async (req, res) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const new_wiki_favorite = new Wiki.Wiki_favorite({
      user_id: req.user[0].id,
      doc_id: doc_id,
    });
    await Wiki.Wiki_favorite.create(new_wiki_favorite);
    res.status(200).json({ success: true, message: "위키 즐겨찾기 추가 성공" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 즐겨찾기 추가 중 오류" });
  }
};

// 위키 즐겨찾기 삭제
exports.wikiFavoriteDeleteMid = async (req, res) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const result = await Wiki.Wiki_favorite.deleteWikiFavorite(
      doc_id,
      req.user[0].id
    );
    if (result == 0) {
      res
        .status(404)
        .json({ success: false, message: "위키 즐겨찾기에 없는 문서입니다." });
    } else {
      res
        .status(200)
        .json({ success: true, message: "위키 즐겨찾기 삭제 성공" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 즐겨찾기 삭제 중 오류" });
  }
};

// 로그인한 유저 기여도 순위 조회
exports.userContributionGetMid = async (req, res) => {
  try {
    const rows = await Wiki.Wiki_point.getRankingById(req.user[0].id);
    const rows2 = await Wiki.Wiki_point.getDocsContributions(req.user[0].id);

    // 모든 doc_point의 합을 계산
    const totalDocPoints = rows2.reduce((acc, doc) => acc + parseFloat(doc.doc_point), 0);

    // 각 문서에 대해 percentage 계산하여 추가
    rows2.forEach(doc => {
      doc.percentage = (parseFloat(doc.doc_point) / totalDocPoints).toFixed(4); // 소수점 두 자리로 제한
    });

    console.log("getRankingById rows:", JSON.stringify(rows, null, 2));
    console.log("getDocsContributions rows2:", JSON.stringify(rows2, null, 2));

    rows.docs = rows2;

    res.status(200).send({ success: true, message: rows });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "유저 기여도 순위 조회 중 오류" });
  }
};

// 전체 기여도 리스트 조회
exports.totalContributionGetMid = async (req, res) => {
  try {
    const rows = await Wiki.Wiki_point.getRanking();
    res.status(200).send({ success: true, message: rows });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "전체 기여도 리스트 조회 중 오류" });
  }
};

// 문서 내 기여도 리스트 조회
exports.contributionGetMid = async (req, res) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    if (doc_id == null) {
      res
        .status(404)
        .send({ success: false, message: "존재하지 않는 문서입니다." });
      return;
    }
    const rows = await Wiki.Wiki_point.getContributors(doc_id);
    res.status(200).send({ success: true, message: rows });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 기여도 리스트 조회 중 오류" });
  }
};

// 특정 히스토리 bad로 변경
exports.badHistoryPutMid = async (req, res) => {
  try {
    const history_id = req.params.hisid;
    await Wiki.Wiki_history.badHistoryById(history_id);
    res
      .status(200)
      .json({ success: true, message: "히스토리 bad로 변경 성공" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "히스토리 bad로 변경 중 오류" });
  }
};

// AI 학습을 위한 최신 데이터 모두 불러오기
exports.allTextsGetMid = async (req, res) => {
  try {
    const title_rows = await Wiki.Wiki_docs.getAllWikiDocs();
    let docs = [];
    for (let i = 0; i < title_rows.length; i++) {
      const title = title_rows[i].replace(/\/+/g, "_");
      const rows = await Wiki.Wiki_docs.getWikiDocsByTitle(title_rows[i]);
      const version = rows.latest_ver;
      let text = "";
      text = await getWikiContent(res, title, version);
      text = text.replace(/\[\[File:data:image\/png;base64[\s\S]*?\]\]/g, " ");
      docs.push({
        id: rows.id,
        title: title_rows[i],
        version: version,
        text: text,
      });
    }
    res.status(200).send({ success: true, docs: docs });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 내용 불러오기 중 오류" });
  }
};

exports.updatedTextsGetMid = async (req, res) => {
  try {
    const check_period = 3;
    const title_rows = await Wiki.Wiki_docs.getUpdatedWikiDocs(check_period);
    let docs = [];
    for (let i = 0; i < title_rows.length; i++) {
      const title = title_rows[i].replace(/\/+/g, "_");
      const rows = await Wiki.Wiki_docs.getWikiDocsByTitle(title_rows[i]);
      const version = rows.latest_ver;
      let text = "";
      text = await getWikiContent(res, title, version);
      text = text.replace(/\[\[File:data:image\/png;base64[\s\S]*?\]\]/g, " ");
      docs.push({
        id: rows.id,
        title: title_rows[i],
        version: version,
        text: text,
      });
    }
    res.status(200).send({ success: true, docs: docs });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 내용 불러오기 중 오류" });
  }
};
