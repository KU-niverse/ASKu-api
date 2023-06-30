const Report = require("../models/reportModel");

// 신고하기
exports.reportPostMid = async (req, res) => {
  try {
    const newReport = new Report({
      user_id: req.body.user_id, // jwt token 적용 시 변경
      type_id: req.params.type,
      target: req.body.target,
      reason_id: req.body.reason_id,
      comment: req.body.comment,
    });
    const result = await Report.createReport(newReport);
    res.status(200).send({result, success: true, message: "신고했습니다."});
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "오류가 발생했습니다."});
  }
};