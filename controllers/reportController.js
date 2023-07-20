const Report = require("../models/reportModel");

// 신고하기
exports.reportPostMid = async (req, res, next) => {
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
    res.status(404).send({message: "오류가 발생했습니다."});
  }
};