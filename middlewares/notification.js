// 알림 생성을 위한 미들웨어입니다.
// 어떤 액션이 있은 후, 알림을 추가해야 할 경우 사용합니다.


/*
type_id 목록
1. 즐겨찾기한 문서 질문
2. 좋아요한 질문 답변
3. 자기가 한 질문에 답변 등록됨
4. 새로운 배지 부여
5. (관리자) 비정상/반복적 글 수정 -> 고민...
6. (관리자) 특정 토큰 이상의 데이터 수정 -> diff 100자
7. (관리자) 새로운 문서 생성됨
8. (관리자) 새로운 신고 생성됨
*/

const Notice = require("../models/notificationModel");

// 알림 생성 -> 다른 쪽에서도 작동하는지 검증 필요
exports.newNotice = async(req, res, next) => {
  try {
    const newNotice = new Notice({
      user_id: req.body.user_id, // jwt token 추가 후 수정
      type_id: req.body.type_id,
      message: req.body.message,
    });
    const result = await Notice.createNotice(newNotice);
    req.notice_result = result;
    next();
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "알림 오류가 발생하였습니다."});
  }
};