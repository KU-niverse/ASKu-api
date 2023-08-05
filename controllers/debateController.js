const {Debate, History, getIdByTitle} = require("../models/debateModel");

// 토론 생성하기
exports.debatePostMid = async (req, res) => {
  try {
    if (!req.body.subject) {
      res.status(400).send({success: false, message: "토론 제목을 입력하세요."});
    } else {
      const doc_id = await getIdByTitle(decodeURIComponent(req.params.title));
      const newDebate = new Debate({
        doc_id: doc_id,
        user_id: req.user[0].id,
        subject: req.body.subject,
      });
      const result = await Debate.createDebate(newDebate);
      res.status(200).send({success: true, message: "토론을 생성하였습니다.", data: result});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방에서 메시지 입력
exports.historyPostMid = async (req, res, next) => {
  try {
    if (!req.body.content) {
      res.status(400).send({success: false, message: "메시지 내용을 입력하세요."});
    } else {
      const newHistory = new History({
        debate_id: req.params.debate,
        user_id: req.user[0].id,
        content: req.body.content,
      });
      req.debate_message = await History.createHistory(newHistory);
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};

// 토론방 목록 조회
exports.debateGetMid = async (req, res) => {
  try {
    const debates = await Debate.getAllDebate(decodeURIComponent(req.params.title));
    res.status(200).send({success: true, message: "토론방 목록을 조회하였습니다.", data: debates});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};


// 토론방 메시지 조회
exports.historyGetMid = async (req, res) => {
  try {
    const histories = await History.getAllHistory(req.params.debate);
    res.status(200).send({success: true, message: "토론 메시지를 조회하였습니다.", data: histories});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};


// 토론방 종결
exports.debateEndPostMid = async (req, res) => {
  try {
    const result = await Debate.endDebate(req.params.debate);
    if (!result) {
      res.status(400).send({success: false, message: "이미 종료된 토론방입니다."});
    } else {
      res.status(200).send({success: true, message: "토론방을 종료하였습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};