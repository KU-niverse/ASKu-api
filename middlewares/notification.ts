// 알림 생성을 위한 미들웨어입니다.
// 어떤 액션 후, 알림을 추가해야 할 경우 사용합니다.

/*
<type_id 목록>
1. 즐겨찾기한 문서에 질문 달림 (V)
2. 좋아요한 질문에 답변 달림(질문 기반 수정) (V)
3. 자기가 한 질문에 답변 등록됨(질문 기반 수정) (V)
4. 새로운 배지가 부여됨 -> 트리거로 구현 완료 (V)
5. (관리자) 특정 토큰 이상의 데이터 수정 (diff 100자) (V)
6. (관리자) 새로운 문서 생성됨 (V)
7. (관리자) 새로운 신고 생성됨 (V)
8. (관리자) 비정상/반복적 글 수정 (1시간에 5번 이상) (V)
*/

/*
<condition_id 설명 및 목록>
각 알림을 보내야 하는 유저 목록과 (getUsers), 적합한 메시지 내용을 얻기 위해 (getInfo) 사용하는 변수입니다!
아래는 주어져야 하는 condition_id의 종류와 getUsers에서의 사용 설명입니다.
1: wiki_docs.id (wiki_favorites에 해당 문서 id 있는 유저 id)
2: questions.id (해당 질문에 답변이 달렸을 때, question_like에 해당하는 유저 id)
3: questions.id (해당 질문의 작성자 유저 id)
4: badge_history.user_id (배지 획득 시 대상 유저 id)
5-8: 사용하지 않습니다! 그냥 -1로 정의해주세요. (is_admin이 1인 유저 id)
*/

/*
<주의사항>
1. 직전 미들웨어는 정상적으로 작동했을 시 res.send로 끝나지 않고, next()로 끝나야 합니다!
2. 사용하기 전, 직전 미들웨어에서 req.body에 types_and_conditions 변수를 명시해주세요.
명시 예시는 "/controllers/reportController" 14-15줄 참고해주세요!
*/


import { Request as ExpressRequest, Response, NextFunction } from "express";
import { Notification as Notice } from "../models/notificationModel";

interface CustomRequest extends ExpressRequest {
  is_rollback?: boolean;
  message?: string;
  data?: string;
}

// 알림 생성
export const newNotice = async (req: CustomRequest, res: Response, next: NextFunction) => {  
  try {
    const typesAndConditions: [] = req.body.types_and_conditions; // [[type_id, condition_id], ...]
    const result = []; // 알림 생성 결과
    
    for (let pair of typesAndConditions) {
      // type_id, condition_id 정의
      const type_id: number = pair[0];
      const condition_id: number = pair[1];
      
      // 알림 받는 user 목록 get
      const users = await Notice.getUsers(type_id, condition_id);
      if (typeof users === 'number') {
        continue;
      }
      
      // 알림 메시지 필요 정보 get
      const info = await Notice.getInfo(type_id, condition_id);
      if (typeof info === 'number') {
        continue;
      }
      
      if (type_id === 8 && !info) {
        continue;
      }
      
      // 알림 메시지 정의
      let message = "";
      switch(type_id) {
      case 1:
        message = `[즐겨찾기] ${info.result} 문서에 질문이 있습니다.`;
        break;
      case 2:
        message = `[좋아요] ${info.title} 문서의 ${info.result} 질문(${info.id})에 답변이 있습니다.`;
        break;
      case 3:
        message = `[질문] ${info.title} 문서의 ${info.result} 질문(${info.id})에 답변이 있습니다.`;
        break;
      case 4:
        message = `[뱃지] ${info.result}를 획득했습니다.`;
        break;
      case 5:
        message = `[관리자] 100자 이상의 문서 수정 발생: ${info.title} 문서의 ${info.result}`;
        break;
      case 6:
        message = `[관리자] 새로운 문서 생성: ${info.result}`;
        break;
      case 7:
        message = `[관리자] 새로운 신고 발생: ${info.result}`;
        break;
      case 8:
        if (!info) {
          break;
        } else{
          message = `[관리자] 비정상/반복적 글 수정 발생: ${info.title} 문서의 ${info.result}`;
          break;
        }
      default:
        message = `잘못된 알림 타입입니다.`;
        break;
      }
      
      // 알림 받는 user마다 알림 생성
      for (let user of users) {
        if (type_id == 1 && user.user_id == req.body.user_id) {
          continue;
        } else {
          const newNotice = new Notice({
            user_id: user.user_id,
            type_id: type_id,
            message: message,
          });
          const user_result = await Notice.createNotice(newNotice);
          result.push(user_result); // 각 user마다 결과 추가
        }
      }
    }
    if (req.is_rollback) {
      next();
    } else {
      res.status(200).send({success: true, message: req.message, data: req.data ? req.data : undefined});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "알림 오류가 발생하였습니다."});
  }
};
