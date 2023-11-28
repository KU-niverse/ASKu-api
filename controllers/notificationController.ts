import { Request, Response } from 'express';
import { Notification as Notice } from "../models/notificationModel";

interface User {
  id: number;
}

interface NoticeRequest extends Request {
  user: User[];
}


// 유저 알림 조회
export const userNoticeGetMid = async (req: NoticeRequest, res: Response) => {
  try {
    const notices = await Notice.getNoticeByRole(req.user[0].id, 0);
    res.status(200).send({success: true, message: "유저 알림 목록을 조회하였습니다.", data: notices[0]});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 관리자 알림 조회
export const adminNoticeGetMid = async (req: NoticeRequest, res: Response) => {
  try {
    const notices = await Notice.getNoticeByRole(req.user[0].id, 1);
    res.status(200).send({success: true, message: "관리자 알림 목록을 조회하였습니다.", data: notices[0]});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 알림 읽음 표시
export const NoticeReadPostMid = async (req: NoticeRequest, res: Response) => {
  try {
    const [result] = await Notice.readNotice(req.body.notification_id, req.user[0].id);
    if ('changedRows' in result && result.changedRows) {
      res.status(200).send({success: true, message: "알림을 읽음 표시하였습니다."});
    } else {
      res.status(400).send({success: false, message: "이미 읽음 표시한 알림입니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};
