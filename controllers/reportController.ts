import { Request, Response, NextFunction } from 'express';
import { Report, getReport } from "../models/reportModel";

// 신고하기
export const reportPostMid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newReport = new Report({
      user_id: req.user[0].id,
      type_id: req.params.type,
      target: req.body.target,
      reason_id: req.body.reason_id,
      comment: req.body.comment
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
export const reportCheckPostMid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.is_checked != 1) {
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