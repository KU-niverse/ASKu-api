const Report = require("../models/reportModel");
const Wiki = require("../models/wikiModel.js");
// admin 위키 히스토리 조회
exports.wikiHistory = async (req, res) => {
  try {
    const wiki_history = await Wiki.Wiki_history.getAllWikiHistory();
    return res.status(200).send({ success: true, message: wiki_history });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "서버 에러" });
  }
};

exports.newDoc = async (req, res) => {
  try {
    const wiki_docs = await Wiki.Wiki_docs.getAllDoc();
    return res.status(200).send({ success: true, message: wiki_docs });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "서버 에러" });
  }
};

exports.report = async (req, res, next) => {
  try {
    const newReport = new Report({
      user_id: req.user[0].id, // jwt token 적용 시 변경
      type_id: req.params.type,
      target: req.body.target,
      reason_id: req.body.reason_id,
      comment: req.body.comment,
    });
    await Report.createReport(newReport);
    req.body.types_and_conditions = [[7, -1]];
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({ message: "오류가 발생했습니다." });
  }
};
