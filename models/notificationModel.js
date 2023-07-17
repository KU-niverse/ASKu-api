const pool = require("../config/db.js");

// notifications 테이블의 column을 가지는 객체
const Notice = function (notice) {
  this.user_id =  notice.user_id;
  this.type_id = notice.type_id;
  this.message = notice.message;
};

// id 넣어주면 해당 id의 notification 반환하는 함수
async function getNotice(id) {
  const row = await pool.query(
    `SELECT * FROM notifications WHERE id = ?`,
    [id]
  );
  return row[0];
}

// 조건에 해당하는 user 목록을 반환하는 함수
async function getUsers(type_id, condition_id) {
  let users = "";
  switch(type_id) {
  case 0:
    users = await pool.query(
      `SELECT user_id FROM wiki_favorites WHERE doc_id = ?`,
      [condition_id]
    );
    break;
  case 1:
    users = await pool.query(
      `SELECT user_id FROM question_like WHERE id = ?`,
      [condition_id]
    );
    break;
  case 2:
    users = await pool.query(
      `SELECT user_id FROM questions WHERE id = ?`,
      [condition_id]
    );
    break;
  case 3:
    users = await pool.query(
      `SELECT user_id FROM badge_history WHERE user_id = ?`,
      [condition_id]
    );
    break;
  case 4:
  case 5:
  case 6:
  case 7:
    users = await pool.query(
      `SELECT id AS user_id FROM users WHERE is_admin = 1`
    );
    break;
  default:
    users = -1;
    break;
  }
  
  return users[0];
  
  // condition_id로 구해야 하는 것 [condition_id]
  // 0: (즐겨찾기) wiki_favorites에 해당 문서 id 있는 유저 id들 [doc_id(wiki_favorite)]
  // 1: (좋아요) 해당 질문에 답변이 달렸을 때, question_like에 해당하는 유저 id들 [id(question)]
  // 2: (본인 질문) questions에서 해당 question의 작성자 유저 id [id(question)]
  // 3: (배지) 배지 획득 시 대상 유저 id [user_id(badge_history)]
  // 4-7: is_admin이 1인 유저들
}

// 조건에 해당하는 message에 필요한 값을 반환하는 함수
async function getInfo(type_id, condition_id) {
  let info = "";
  switch(type_id) {
  case 0: // doc_id로 문서 제목 찾기
    info = await pool.query(
      `SELECT title FROM wiki_docs WHERE id = ?`,
      [condition_id]
    );
    break;
  case 1: // question_id로 질문 내용 찾기
    info = await pool.query(
      `SELECT content AS result FROM questions WHERE id = ?`,
      [condition_id]
    );
    break;
  case 2: // question_id로 문서 제목 찾기
    info = await pool.query(
      `SELECT doc_id AS result FROM questions WHERE id = ?`,
      [condition_id]
    );
    break;
  case 3: // user_id로 badge_id 찾아서 배지 이름 찾기
    info = await pool.query(
      `SELECT name AS result FROM badges WHERE id in 
      (SELECT badge_id FROM badge_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 1)`,
      [condition_id]
    );
    break;
  case 4: // wiki_history에서 diff가 100보다 큰 history id
    info = await pool.query(
      `SELECT id AS result FROM wiki_history WHERE diff > 100 ORDER BY created_at DESC LIMIT 1`
    );
    break;
  case 5: // wiki_docs에서 가장 최근 생성된 문서 제목
    info = await pool.query(
      `SELECT title AS result FROM wiki_docs ORDER BY created_at DESC LIMIT 1`
    );
    break;
  case 6: // reports에서 가장 최근 생성된 신고 id
    info = await pool.query(
      `SELECT LAST_INSERT_ID() AS result FROM reports ORDER BY id DESC LIMIT 1`
    );
    break;
  case 7: // 비정상/반복적 위키 수정 히스토리 id
    info = await pool.query(
      `SELECT id AS result FROM wiki_history WHERE ` // ?? 
    );
    break;
  default:
    info = -1;
    break;
  }
  return info[0][0].result;
}

// 새로운 notification을 생성해주는 함수
Notice.createNotice = async (newNotice) => {
  const result = await pool.query(
    `INSERT INTO notifications SET ?`,
    newNotice
  );
  const id = result.insertId;
  return getNotice(id);
};

// 모든 notification을 조회하는 함수
Notice.getNoticeAll = async (user_id) => {
  const rows = await pool.query(
    `SELECT * FROM notifications WHERE user_id = ?`,
    [user_id]
  );
  return rows;
};

// 일반 or 관리자 notification을 조회하는 함수
Notice.getNoticeByRole = async (user_id, is_admin) => {
  const rows = await pool.query(
    `SELECT N.id, N.user_id, N.type_id, N.read_or_not, N.message, N.created_at, T.is_admin 
    FROM notifications N 
    INNER JOIN notification_type T 
    ON N.type_id = T.id 
    WHERE N.user_id = ? AND T.is_admin = ?;`,
    [user_id, is_admin]
  );
  return rows;
};

// notification을 읽음 처리하는 함수
Notice.readNotice = async (id, user_id) => {
  const result = await pool.query(
    `UPDATE notifications SET read_or_not = 1 WHERE id = ? AND user_id = ?`,
    [id, user_id]
  );
  return result;
};

module.exports = {Notice, getInfo, getUsers};