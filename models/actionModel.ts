import { OkPacket } from "mysql2/promise";
import pool from "../config/db";

interface ActionType {
  user_id: number;
  record_count: number;
  revise_count: number;
  report_count: number;
  debate_count: number;
  question_count: number;
  like_count: number;
  answer_count: number;
  event_begin: number;
}

// user_action 테이블의 column을 가지는 객체
export class Action implements ActionType {
  user_id: number;
  record_count: number;
  revise_count: number;
  report_count: number;
  debate_count: number;
  question_count: number;
  like_count: number;
  answer_count: number;
  event_begin: number;
  
  constructor({user_id, record_count, revise_count, report_count, debate_count, question_count, like_count, answer_count, event_begin}: ActionType) {
    this.user_id = user_id;
    this.record_count = record_count;
    this.revise_count = revise_count;
    this.report_count = report_count;
    this.debate_count = debate_count;
    this.question_count = question_count;
    this.like_count = like_count;
    this.answer_count = answer_count;
    this.event_begin = event_begin;
  }
  
  // user_id 넣어주면 해당 user의 action 목록 반환하는 함수
  static async getAction(user_id: number) {
    const [row] = await pool.query(
      `SELECT * FROM user_action WHERE user_id = ?`,
      [user_id]
    );
    return row;
  }
  
  // Action을 생성하는 함수
  static initAction = async (user_id: number) => {
    const data = {
      user_id: user_id,
      record_count: 0,
      revise_count: 0,
      report_count: 0,
      debate_count: 0,
      question_count: 0,
      like_count: 0,
      answer_count: 0,
      event_begin: 0
    };
    
    const [result] = await pool.query(
      `INSERT INTO user_action SET ?`,
      data
    ) as OkPacket[];
    const id = result.insertId;
    return await Action.getAction(id);
  };
  
  // count_type에 따라 Action을 update하는 함수
  /*
  <count_type>
  1: record_count (일반 기록 글자수) - diff에 담아서 글자수 보낼 것, 다른 경우는 사용하지 않으므로 0으로 정의
  2: revise_count (일반 수정 횟수)
  3: report_count (일반 신고 횟수)
  4: debate_count (일반 토론 작성 개수)
  5: question_count (일반 질문 개수)
  6: like_count (일반 추천 개수)
  7: answer_count (일반 답변 개수)
  */
  static updateAction = async (user_id: number, count_type: number, diff: number) => {
    let result: OkPacket | number;
    switch(count_type) {
    case 1:
      if (diff < 0) {
        diff = 0;
      }
      [result] = await pool.query(
        `UPDATE user_action SET record_count = record_count + ? WHERE user_id = ?`,
        [diff, user_id]
      ) as OkPacket[];
      break;
    case 2:
      [result] = await pool.query(
        `UPDATE user_action SET revise_count = revise_count + 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    case 3:
      [result] = await pool.query(
        `UPDATE user_action SET report_count = report_count + 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    case 4:
      [result] = await pool.query(
        `UPDATE user_action SET debate_count = debate_count + 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    case 5:
      [result] = await pool.query(
        `UPDATE user_action SET question_count = question_count + 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    case 6:
      [result] = await pool.query(
        `UPDATE user_action SET like_count = like_count + 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    case 7:
      [result] = await pool.query(
        `UPDATE user_action SET answer_count = answer_count + 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    default:
      result = -1;
      break;
    }
    return result;
  };
  
  
  // count_type에 따라 action을 취소하는 함수
  static cancelAction = async (user_id: number, count_type: number) => {
    let result: OkPacket | number;
    switch (count_type) {
    case 5:
      [result] = await pool.query(
        `UPDATE user_action SET question_count = question_count - 1 WHERE user_id = ?`,
        [user_id]
      ) as OkPacket[];
      break;
    default:
      result = -1;
      break;
    }
    return result;
  };
}



