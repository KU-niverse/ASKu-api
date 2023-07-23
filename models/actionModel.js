const pool = require("../config/db.js");

// user_action 테이블의 column을 가지는 객체
const Action = function (action) {
  this.user_id = action.user_id;
  this.record_count = action.record_count;
  this.revise_count = action.revise_count;
  this.report_count = action.report_count;
  this.debate_count = action.debate_count;
  this.question_count = action.question_count;
  this.like_count = action.like_count;
  this.answer_count = action.answer_count;
  this.event_begin = action.event_begin;
};

// user_id 넣어주면 해당 user의 action 목록 반환하는 함수
async function getAction(user_id) {
  const [row] = await pool.query(
    `SELECT * FROM user_action WHERE user_id = ?`,
    [user_id]
  );
  return row;
}

// Action을 생성하는 함수
Action.initAction = async (user_id) => {
  const [result] = await pool.query(
    `INSERT INTO user_action SET ?`,
    [user_id, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  const id = result.insertId;
  return await getAction(id);
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
Action.updateAction = async (user_id, count_type, diff) => {
  let result;
  switch(count_type) {
  case 1:
    [result] = await pool.query(
      `UPDATE user_action SET record_count = record_count + ? WHERE user_id = ?`,
      [diff, user_id]
    );
    break;
  case 2:
    [result] = await pool.query(
      `UPDATE user_action SET revise_count = revise_count + 1 WHERE user_id = ?`,
      [user_id]
    );
    break;
  case 3:
    [result] = await pool.query(
      `UPDATE user_action SET report_count = report_count + 1 WHERE user_id = ?`,
      [user_id]
    );
    break;
  case 4:
    [result] = await pool.query(
      `UPDATE user_action SET debate_count = debate_count + 1 WHERE user_id = ?`,
      [user_id]
    );
    break;
  case 5:
    [result] = await pool.query(
      `UPDATE user_action SET question_count = question_count + 1 WHERE user_id = ?`,
      [user_id]
    );
    break;
  case 6:
    [result] = await pool.query(
      `UPDATE user_action SET like_count = like_count + 1 WHERE user_id = ?`,
      [user_id]
    );
    break;
  case 7:
    [result] = await pool.query(
      `UPDATE user_action SET answer_count = answer_count + 1 WHERE user_id = ?`,
      [user_id]
    );
    break;
  default:
    result = -1;
    break;
  }
  return result;
};

// FIXME: Action을 취소하는 함수 (question)