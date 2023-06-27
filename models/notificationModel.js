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

module.exports = Notice;