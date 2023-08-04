const {Report, getReport} = require("../models/reportModel");

// 신고하기
exports.reportPostMid = async (req, res, next) => {
  try {
    const newReport = new Report({
      user_id: req.user[0].id,
      type_id: req.params.type,
      target: req.body.target,
      reason_id: req.body.reason_id,
      comment: req.body.comment,
    });
    req.data = await Report.createReport(newReport);
    req.message = "신고를 생성하였습니다.";
    req.body.types_and_conditions = [[7, -1]];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 신고 확인하기
exports.reportCheckPostMid = async (req, res, next) => {
  try {
    if (!req.body.is_checked) {
      res.status(406).send({success: false, message: "잘못된 확인값입니다."});
    } else {
      const result = await Report.checkReport(req.body.report_id, req.body.is_checked);
      if (result[0].changedRows) {
        const report = await getReport(req.body.report_id);
        req.report_user = report[0].user_id;
        next();
      } else {
        res.status(400).send({success: false, message: "이미 확인한 신고입니다."});
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};