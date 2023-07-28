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

exports.report = async (req, res) => {
  try {
    const reports = await Report.getAllReport();
    console.log(typeof reports);
    return res.status(200).send({ success: true, message: reports });
  } catch (err) {
    console.error(err);
    console.log("adminContoller-report에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};
