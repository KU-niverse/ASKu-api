const Wiki = require("../models/wikiModel.js");
const { getWikiContent } = require("../controllers/wikiController.js");

// 위키 히스토리 생성 미들웨어
exports.createHistoryMid = async (req, res, next) => {
  // 프론트에서 질문 기반 수정이면 꼭 req.body.is_q_based = 1와 req.body.qid 넣어주기
  try {
    const is_q_based =
      req.body.is_q_based !== undefined && req.body.is_q_based != ""
        ? req.body.is_q_based
        : 0;
    const is_rollback = req.is_rollback !== undefined ? req.is_rollback : 0;
    console.log(
      "🚀 ~ file: wiki.js:13 ~ exports.createHistoryMid= ~ req:",
      req.body
    );

    const new_wiki_history = new Wiki.Wiki_history({
      user_id: req.user[0].id,
      doc_id: req.doc_id,
      text_pointer: req.text_pointer,
      summary: req.summary,
      count: req.count,
      diff: req.diff,
      version: req.version,
      is_q_based: is_q_based,
      is_rollback: is_rollback,
      index_title: req.body.index_title,
    });

    const wiki_history_id = await Wiki.Wiki_history.create(new_wiki_history);
    req.is_q_based = is_q_based;

    // res message 정의 (롤백 제외)
    req.message = "위키 히스토리를 생성하였습니다.";

    /* 알림 변수 정의*/
    if (!req.body.types_and_conditions) {
      // type_id: 6(글 생성)의 경우 newWikiPostMid에서 이미 변수가 정의됨
      req.body.types_and_conditions = [];
    }

    // 질문 기반 수정 -> type_id: 2, 3
    if (is_q_based == true) {
      // 답변 생성
      Wiki.Wiki_history.createAnswer(wiki_history_id, req.body.qid);
      req.body.types_and_conditions.push([2, req.body.qid]);
      req.body.types_and_conditions.push([3, req.body.qid]);
    }

    // 100자 이상 수정 -> type_id: 5
    if (req.diff >= 100) {
      req.body.types_and_conditions.push([5, -1]);
    }

    // 비정상/반복적 수정 -> type_id: 8 (비정상 여부 확인은 newNotice에서 함)
    req.body.types_and_conditions.push([8, -1]);

    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 히스토리 생성 중 오류" });
  }
};

// 위키 작성 기여도 지급 미들웨어
exports.wikiPointMid = async (req, res, next) => {
  try {
    Wiki.Wiki_point.givePoint(req.user[0].id, req.diff, req.is_q_based);
    // 알림
    next();
    //res.status(200).json({ message: "위키 작성 기여도 지급 성공" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "위키 작성 기여도 지급 중 오류" });
  }
};

// 위키 최신 내용 db 업데이트 미들웨어
exports.wikiChangeRecentContentMid = async (req, res, next) => {
  try {
    const doc_id = await Wiki.Wiki_docs.getWikiDocsIdByTitle(req.params.title);
    const rows = await Wiki.Wiki_history.getRecentWikiHistoryByDocId(doc_id);
    const title = req.params.title.replace(/\/+/g, "_");
    const version = rows[0].version;
    let text = "";

    text = await getWikiContent(res, title, version);

    await Wiki.Wiki_docs.updateRecentContent(doc_id, text);
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "최신 내용 업데이트 중 오류" });
  }
};
