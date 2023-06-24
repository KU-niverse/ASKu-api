const Question = require("../models/questionModel.js");

// 질문 조회하기
exports.questionGetMid = async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const questions = await Question.getQuestionsAll(title);
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
      const newQuestion = new Question({
        doc_id: req.body.doc_id,
        user_id: req.body.user_id, // jwt token 적용 시 변경
        index_title: req.params.title,
        content: req.body.content,
      });
      const result = await Question.createQuestion(newQuestion);
      console.log(result);
      res.status(200).send({result, message: "질문을 등록했습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};

// 질문 수정하기 [답변이 달리기 전까지만 가능]



// 질문 삭제하기 [답변이 달리기 전, 좋아요 눌리기 전까지만 가능]


// 질문 좋아요 누르기
exports.questionLikeMid = async (req, res) => {
  try {
    const result = await Question.likeQuestion(req.body.question_id, req.body.user_id); // jwt token 추가 후 수정
    if (!result) {
      res.status(400).send({message: "이미 좋아요를 눌렀습니다."});
    } else {
      res.status(200).send({message: "좋아요를 등록했습니다."});
    }
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};


// 질문 제목 기반으로 검색하기
