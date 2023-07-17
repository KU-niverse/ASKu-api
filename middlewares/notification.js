// 알림 생성을 위한 미들웨어입니다.
// 어떤 액션이 있은 후, 알림을 추가해야 할 경우 사용합니다.


/*
type_id 목록
1. 즐겨찾기한 문서 질문
2. 좋아요한 질문 답변
3. 자기가 한 질문에 답변 등록됨
4. 새로운 배지 부여
5. (관리자) 특정 토큰 이상의 데이터 수정 -> diff 100자
6. (관리자) 새로운 문서 생성됨
7. (관리자) 새로운 신고 생성됨
8. (관리자) 비정상/반복적 글 수정 -> 고민...
*/

const {getUsers, getInfo, Notice} = require("../models/notificationModel");

// 알림 생성
exports.newNotice = async(req, res) => {
  try {
    const type_id = req.body.notice_id;
    const condition_id = req.body.condition_id;
    
    let message = "";
    const info = await getInfo(type_id, condition_id);
    switch(type_id) {
    case 0:
      message = `즐겨찾기한 ${info} 문서에 질문이 있습니다.`;
      break;
    case 1:
      message = `좋아요를 누른 ${info} 질문에 답변이 있습니다.`;
      break;
    case 2:
      message = `${info} 문서의 질문에 답변이 있습니다.`;
      break;
    case 3:
      message = `새로운 뱃지를 획득했습니다.: ${info}`;
      break;
    case 4:
      message = `[관리자] 100자 이상의 문서 수정 발생: ${info}`;
      break;
    case 5:
      message = `[관리자] 새로운 문서 생성: ${info}`;
      break;
    case 6:
      message = `[관리자] 새로운 신고 발생: ${info}`;
      break;
    case 7:
      message = `비정상/반복적 글 수정 발생: ${info}`;
      break;
    default:
      message = `잘못된 알림 타입입니다.`;
      break;
    }
    
    const users = await getUsers(type_id, condition_id);
    
    const result = [];
    
    for (let i of users) {
      const newNotice = new Notice({
        user_id: i.user_id,
        type_id: type_id,
        message: message,
      });
      const user_result = await Notice.createNotice(newNotice);
      result.push(user_result);
    }
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(404).send({message: "알림 오류가 발생하였습니다."});
  }
};

