const Report = require("../models/reportModel");
const Wiki = require("../models/wikiModel.js");
const User = require("../models/userModel.js");
const pool = require("../config/db.js");
// admin 위키 히스토리 조회
exports.wikiHistory = async (req, res) => {
  try {
    const wiki_history = await Wiki.Wiki_history.getAllWikiHistory();
    return res
      .status(200)
      .send({
        success: true,
        data: wiki_history,
        message: "성공적으로 위키 히스토리를 불러왔습니다.",
      });
  } catch (error) {
    console.error(error);
    console.log("adminController-wikiHistory에서 에러 발생");
    return res.status(500).send({ success: false, message: "서버 에러" });
  }
};

exports.newDoc = async (req, res) => {
  try {
    const wiki_docs = await Wiki.Wiki_docs.getAllDoc();
    return res.status(200).send({
      success: true,
      data: wiki_docs,
      messgae: "성공적으로 문서목록을 불러왔습니다.",
    });
  } catch (err) {
    console.error(err);
    console.log("adminController-newDoc에서 에러 발생");
    res.status(500).send({ success: false, message: "서버 에러" });
  }
};

exports.report = async (req, res) => {
  try {
    const reports = await Report.getAllReport();
    console.log(typeof reports);
    return res.status(200).send({
      success: true,
      data: reports,
      message: "성공적으로 신고목록을 불러왔습니다.",
    });
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
    const user = await User.findById(target_user_id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "해당 유저를 찾을 수 없습니다.",
      });
    }

    await User.setConstraint(target_user_id, restrict_period);

    if (restrict_period === 0) {
      return res.status(200).send({
        success: true,
        message: "성공적으로 제한을 해제했습니다.",
      });
    }

    return res.status(200).send({
      success: true,
      message: `성공적으로 ${restrict_period}일 제한을 설정했습니다.`,
    });
  } catch (err) {
    console.error(err);
    console.log("adminContoller-setConstraint에서 에러 발생");

    return res.status(500).send({
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

//문서별 조회수 순위가 많은 순으로 출력
exports.getDocsViews = async(req, res) =>{
  try{
    const result = await pool.query(
      `
      SELECT A.title, count(*) as DOCS_VIEWS
      FROM wiki_docs A INNER JOIN wiki_docs_views B ON A.id = B.doc_id
      GROUP BY B.doc_id
      ORDER BY DOCS_VIEWS DESC
      LIMIT 100
      `
    )
    return res.status(200).send({
      success: true,
      data: result[0],
      message: "성공적으로 문서 조회수 순위를 가져왔습니다.",
    });
  }catch(error){
    console.error(error);
    console.log("adminContoller-getDocsViews에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};

//회원 별 닉네임, 기여도, 기여 순위
exports.getUserList = async(req, res)=>
{
  try{
    const result = await pool.query(
      `
      SELECT users.* 
      FROM users
      ORDER BY point DESC
      `
    );
    return res.status(200).send({
      success: true,
      data: result[0],
      message: "성공적으로 회원 별 닉네임, 기여도, 기여 순위를 가져왔습니다.",
    });
  }catch(error){
    console.error(error);
    console.log("adminContoller-getUserList에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};
