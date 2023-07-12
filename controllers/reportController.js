const Report = require("../models/reportModel");

// 신고하기
exports.reportPostMid = async (req, res) => {
  try {
    const newReport = new Report({
      user_id: req.user[0].id, // jwt token 적용 시 변경
      type_id: req.params.type,
      target: req.body.target,
      reason_id: req.body.reason_id,
      comment: req.body.comment,
    });
    const result = await Report.createReport(newReport);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생했습니다."});
  }
};