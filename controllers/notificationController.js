const Notice = require("../models/notificationModel");


// 유저 알림 조회
exports.userNoticeGetMid = async(req, res) => {
  try {
    const notices = await Notice.getNoticeByRole(req.body.user_id, 0);
    res.status(200).send(notices[0]);
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};

// 관리자 알림 조회
exports.adminNoticeGetMid = async(req, res) => {
  try {
    const notices = await Notice.getNoticeByRole(req.body.user_id, 1);
    res.status(200).send(notices[0]);
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};

// 알림 읽음 표시
exports.NoticeReadPostMid = async(req, res) => {
  try {
    const result = await Notice.readNotice(req.body.notification_id, req.body.user_id);
    console.log(result);
    if (result[0].changedRows) {
      res.status(200).send({message: "알림을 읽음 표시하였습니다."});
    } else {
      res.status(400).send({message: "이미 읽음 표시한 알림입니다."});
    }
    
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};
