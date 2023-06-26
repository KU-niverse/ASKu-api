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