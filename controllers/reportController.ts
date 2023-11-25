import { Request, Response, NextFunction } from 'express';
import { Report } from "../models/reportModel";
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

interface ReportRequest extends Request {
  report_user?: number;
  data?: OkPacket | RowDataPacket[] | RowDataPacket[][] | OkPacket[] | ResultSetHeader;
  message?: string
}

// 신고하기
export const reportPostMid = async (req: ReportRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user && Array.isArray(req.user)) {
      const newReport = new Report({
        user_id: req.user[0].id,
        type_id: Number(req.params.type),
        target: req.body.target,
        reason_id: req.body.reason_id,
        comment: req.body.comment
      });
      req.data = await Report.createReport(newReport);
      req.message = "신고를 생성하였습니다.";
      req.body.types_and_conditions = [[7, -1]];
      next();
    } else {
      throw new Error("User is undefined or not an array");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 신고 확인하기
export const reportCheckPostMid = async (req: ReportRequest, res: Response, next: NextFunction) => {
  try {
    if (req.body.is_checked != 1) {
      res.status(406).send({success: false, message: "잘못된 확인값입니다."});
    } else {
      const result = await Report.checkReport(req.body.report_id, req.body.is_checked) as unknown as OkPacket;
      if (result.changedRows) {
        const reportResult = await Report.getReport(req.body.report_id);
        if (Array.isArray(reportResult) && reportResult.length > 0) {
          const report = reportResult[0];
          if ('user_id' in report) {
            req.report_user = report.user_id;
            next();
          } else {
            // user_id 속성이 없는 경우의 처리
            res.status(500).send({ success: false, message: "Report 데이터에 user_id가 없습니다." });
          }
        }
      } else {
        res.status(400).send({success: false, message: "이미 확인한 신고입니다."});
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};
