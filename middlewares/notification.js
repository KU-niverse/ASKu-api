// 알림 생성을 위한 미들웨어입니다.
// 어떤 액션이 있은 후, 알림을 추가해야 할 경우 사용합니다.


/*
type_id 목록 (수정될 수 있음)
1. 즐찾 문서 질문
2. 좋아요한 질문 답변
3. 자신 질문 답변 / 수정
4. 새로운 배지 부여
5. (관리자) 비정상/반복적 글 수정
6. (관리자) 특정 토큰 이상의 데이터 수정
7. (관리자) 문서 생성
*/

const Notice = require("../models/notificationModel");

// 알림 생성
exports.newNotice = async(req, res) => {
  try {
    const newNotice = new Notice({
      user_id: req.body.user_id, // jwt token 추가 후 수정
      type_id: req.params.type_id, // TODO: 미들웨어 동작 따라서 body로 수정 가능
      message: req.body.message,
    });
    const result = await Notice.createNotice(newNotice);
    return res.status(200).json({result, message: "유저 알림을 생성하였습니다."});
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "오류가 발생하였습니다."});
  }
};