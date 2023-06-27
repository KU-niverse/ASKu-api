const Wiki = require("../models/wikiModel.js");

// 위키 히스토리 생성 미들웨어
exports.createHistoryMid = async (req, res, next) => {
  // 프론트에서 질문 기반 수정이면 꼭 req.body.is_q_based = 1와 req.body.qid 넣어주기
  try {
    const is_q_based = req.body.is_q_based !== undefined ? req.body.is_q_based : 0;
    const is_rollback = req.is_rollback !== undefined ? req.is_rollback : 0;

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
    });

    const rows_history = await Wiki.Wiki_history.create(new_wiki_history);
    console.log(rows_history);
    
    req.is_q_based = is_q_based;
    if (is_q_based) {
      // 답변 생성
      Wiki.Wiki_history.createAnswer(req.body.qid, rows_history.id);
    }
    // 기여도 -> 알림
    next();
    // res.status(200).json({ message: "위키 히스토리 생성 성공" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 히스토리 생성 중 오류" });
  }
};

// 위키 작성 기여도 지급 미들웨어
exports.wikiPointMid = async (req, res) => {
  try {
    Wiki.Wiki_point.givePoint(req.user[0].id, req.diff, req.is_q_based);
    // 알림
    //next();
    res.status(200).json({ message: "위키 작성 기여도 지급 성공" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 작성 기여도 지급 중 오류" });
  }
};