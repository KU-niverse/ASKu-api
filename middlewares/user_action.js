// user_action 미들웨어
// TODO: 신고 승인 시 해당하는 action 회수하는 로직 필요 -> 위키 히스토리, 질문, 토론 메시지

const Action = require("../models/actionModel");

exports.newActionRecord = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 1, req.diff);
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "글자수 action 오류가 발생했습니다."});
  }
};

exports.newActionRevise = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 2, 0);
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "수정 action 오류가 발생했습니다."});
  }
};

exports.newActionReport = async (req, res) => {
  try {
    await Action.updateAction(req.report_user, 3, 0);
    res.status(200).send({success: true, message: "신고를 확인했습니다."});
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "신고 action 오류가 발생했습니다."});
  }
};

exports.newActionDebate = async (req, res) => {
  try {
    await Action.updateAction(req.user[0].id, 4, 0);
    res.status(200).send(req.debate_message);
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "토론 action 오류가 발생했습니다."});
  }
};

exports.newActionQuestion = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 5, 0);
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "질문 action 오류가 발생했습니다."});
  }
};

exports.newActionLike = async (req, res) => {
  try {
    await Action.updateAction(req.user[0].id, 6, 0);
    res.status(200).send({message: "좋아요를 등록했습니다."});
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "좋아요 action 오류가 발생했습니다."});
  }
};

exports.newActionAnswer = async (req, res, next) => {
  try {
    if (req.is_q_based == true) {
      await Action.updateAction(req.user[0].id, 7, 0);
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "답변 action 오류가 발생했습니다."});
  }
};

exports.cancelActionQuestion = async (req, res) => {
  try {
    await Action.cancelAction(req.user[0].id, 5);
    res.status(200).send({message: "질문을 삭제하였습니다."});
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "질문 취소 action 오류가 발생했습니다."});
  }
};

// 기본 양식 -> action 추가될 경우 사용
// exports.newActionDefault = async (req, res, next) => {
//   try {
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(404).send({success: false, message: "default action 오류가 발생했습니다."});
//   }
// };