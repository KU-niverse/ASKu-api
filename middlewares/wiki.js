const Wiki = require("../models/wikiModel.js");

// 위키 히스토리 생성 미들웨어
exports.createHistoryMid = async (req, res) => {
  try {
    const new_wiki_history = new Wiki.Wiki_history({
      //user_id: req.user[0].user_id, 로그인 후 반영
      user_id: 1,
      doc_id: req.rows_docs.id,
      text_pointer: req.text_pointer,
      summary: req.summary,
      count: req.count,
      diff: req.count,
      version: req.version,
    });

    const rows_history = await Wiki.Wiki_history.create(new_wiki_history);
    console.log(rows_history);
    
    // 기여도 -> 알림
    //next();
    res.status(200).json({ message: "위키 히스토리 생성 성공" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 히스토리 생성 중 오류" });
  }
};

// 위키 작성 기여도 지급 미들웨어
exports.wikiPointMid = async (req, res) => {
  try {
    // 기여도 지급, 프론트에서 질문 기반 수정이면 꼭 req.body.is_qbased = 1 넣어주기
    const is_qbased = req.body.is_qbased !== undefined ? req.body.is_qbased : 0;
    Wiki.Wiki_point.givePoint(req.user[0].user_id, req.diff, is_qbased);
    // 알림
    //next();
    res.status(200).json({ message: "위키 작성 기여도 지급 성공" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "위키 작성 기여도 지급 중 오류" });
  }
};