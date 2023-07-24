// user_action 미들웨어

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

exports.newActionReport = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 3, 0); //FIXME: req.user[0].id가 아니라 req.body.report_id의 user_id
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "신고 action 오류가 발생했습니다."});
  }
};

exports.newActionDebate = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 4, 0);
    next();
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

exports.newActionLike = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 6, 0);
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "좋아요 action 오류가 발생했습니다."});
  }
};

exports.newActionAnswer = async (req, res, next) => {
  try {
    await Action.updateAction(req.user[0].id, 7, 0);
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({success: false, message: "답변 action 오류가 발생했습니다."});
  }
};

exports.cancelActionQuestion = async (req, res, next) => {
  try {
    await Action.deleteAction(req.user[0].id, 5);
    next();
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