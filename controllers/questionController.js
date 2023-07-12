const {Question, getIdByTitle} = require("../models/questionModel.js");

// 질문 조회하기
exports.questionGetMid = async (req, res) => {
  try {
    const doc_id = await getIdByTitle(decodeURIComponent(req.params.title));
    const questions = await Question.getQuestionsAll(doc_id);
    res.status(200).send(questions);
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};

// 질문 등록하기
exports.questionPostMid = async (req, res) => {
  try {
    if (!req.body.content) {
      res.status(400).send({message: "내용을 작성해주세요."});
    } else {
      const doc_id = await getIdByTitle(req.params.title);
      const newQuestion = new Question({
        doc_id: doc_id,
        user_id: req.user[0].id, // jwt token 적용 시 변경
        index_title: req.body.index_title,
        content: req.body.content,
      });
      const result = await Question.createQuestion(newQuestion);
      res.status(200).send({result, message: "질문을 등록했습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};

// 질문 수정하기 [답변이 달리기 전까지만 가능]
exports.questionEditMid = async(req, res) => {
  try {
    const result = await Question.updateQuestion(req.params.question, req.user[0].id, req.body.new_content);
    if (!result) {
      res.status(400).send({messsage: "이미 답변이 달렸거나, 다른 회원의 질문입니다,"});
    } else {
      res.status(200).send({message: "질문을 수정하였습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};


// 질문 삭제하기 [답변이 달리기 전, 좋아요 눌리기 전까지만 가능]
exports.questionDeleteMid = async(req, res) => {
  try {
    const result = await Question.deleteQuestion(req.params.question, req.user[0].id);
    if (!result) {
      res.status(400).send({message: "이미 답변 및 좋아요가 달렸거나, 다른 회원의 질문입니다."});
    } else {
      res.status(200).send({message: "질문을 삭제하였습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};


// 질문 좋아요 누르기
exports.questionLikeMid = async (req, res) => {
  try {
    const result = await Question.likeQuestion(req.params.question, req.user[0].id); // jwt token 추가 후 수정
    if (result == 0) {
      res.status(400).send({message: "이미 좋아요를 눌렀습니다."});
    } else if (result == -1) {
      res.status(401).send({message: "본인의 질문에는 좋아요를 누를 수 없습니다."});
    } else {
      res.status(200).send({message: "좋아요를 등록했습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};


// 질문 제목 기반으로 검색하기
exports.questionSearchGetMid = async (req, res) => {
  try {
    if (!req.params.query || req.params.query == " ") {
      res.status(400).send({message: "검색어를 입력해주세요."});
    } else {
      const questions = await Question.getQuestionSearchByQuery(decodeURIComponent(req.params.query));
      res.status(200).send(questions);
    }

  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};


// 인기 질문 조회하기
exports.questionPopularGetMid = async (req, res) => {
  try {
    const questions = await Question.getQuestionsPopular();
    res.status(200).send(questions);
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."}); 
  }
};