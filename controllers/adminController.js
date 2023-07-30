const Report = require("../models/reportModel");
const Wiki = require("../models/wikiModel.js");
const User = require("../models/userModel.js");
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

exports.setConstraint = async (req, res) => {
  try {
    const { target_user_id, restrict_period } = req.body;
    await User.setConstraint(target_user_id, restrict_period);
    if (restrict_period === 0) {
      return res
        .status(200)
        .send({ success: true, message: `성공적으로 제한을 해제했습니다.` });
    }
    return res.status(200).send({
      success: true,
      message: `성공적으로 ${restrict_period}일 제한을 설정습니다.`,
    });
  } catch (err) {
    console.error(err);
    console.log("adminContoller-setConstraint에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.getConstraint = async (req, res) => {
  try {
    const result = await User.getConstraint();
    return res.status(200).send({
      success: true,
      data: result,
      message: "성공적으로 제한중인 유저 목록을 가져왔습니다.",
    });
  } catch (error) {
    console.error(error);
    console.log("adminContoller-getConstraint에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};
