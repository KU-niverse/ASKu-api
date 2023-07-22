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

// 신고 확인하기
exports.reportCheckPostMid = async (req, res, next) => {
  try {
    const result = await Report.checkReport(req.body.report_id, req.body.is_checked);
    if (result[0].changedRows) {
      res.status(200).send({message: "신고를 확인하였습니다."});
    } else {
      res.status(400).send({message: "이미 확인한 알림입니다."});
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생했습니다."});
  }
};