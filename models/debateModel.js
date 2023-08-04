const pool = require("../config/db");

// debates 테이블의 column을 가지는 객체
const Debate = function (debate) {
  this.doc_id = debate.doc_id;
  this.user_id = debate.user_id;
  this.subject = debate.subject;
};

// debate_history 테이블의 column을 가지는 객체
const History = function (history) {
  this.debate_id = history.debate_id;
  this.user_id = history.user_id;
  this.content = history.content;
};

// wiki_docs의 title을 입력하면 해당 문서의 id 반환하는 함수
async function getIdByTitle(title) {
  const result = await pool.query(
    `SELECT id FROM wiki_docs WHERE title = ?`,
    [title]
  );
  return result[0][0].id;
}

// id를 입력하면 해당 id의 debate 반환하는 함수
async function getDebate(id) {
  const row = await pool.query(
    `SELECT * FROM debates WHERE id = ?`,
    [id]
  );
  return row[0];
}

// id를 입력하면 해당 id의 debate_history 반환하는 함수
async function getHistory(id) {
  const row = await pool.query(
    `SELECT * FROM debate_history WHERE id = ?`,
    [id]
  );
  return row[0];
}

// 새로운 debate를 생성하는 함수
Debate.createDebate = async (newDebate) => {
  const result = await pool.query("INSERT INTO debates SET ?", newDebate);
  const id = result[0].insertId;
  return getDebate(id);
};

// 새로운 history를 생성하는 함수
History.createHistory = async (newHistory) => {
  const result = await pool.query("INSERT INTO debate_history SET ?", newHistory);
  const date = new Date();
  date.setHours(date.getHours()+9);
  await pool.query(
    `UPDATE debates SET recent_edited_at = ? WHERE id = ?`,
    [date.toISOString().slice(0, 19).replace('T', ' '), newHistory.debate_id]
  );
  const id = result[0].insertId;
  return getHistory(id);
};

// debate 목록을 조회하는 함수 (최근 생성순)
Debate.getAllDebate = async (title) => {
  const doc_id = await getIdByTitle(title);
  const result = await pool.query(
    `SELECT * FROM debates WHERE doc_id = ? ORDER BY created_at`,
    [doc_id]
  );
  return result[0];
};

// 특정 debate의 debate_history를 조회하는 함수
History.getAllHistory = async (debate_id) => {
  const result = await pool.query(
    `SELECT * FROM debate_history WHERE debate_id = ? ORDER BY created_at`,
    [debate_id]
  );
  return result[0];
};

// debate를 종료시키는 함수
Debate.endDebate = async (id) => {
  const flag = await pool.query(
    `SELECT done_or_not FROM debates WHERE id = ?`,
    [id]
  );
  if (flag[0][0].done_or_not) {
    return 0;
  } else {
    const date = new Date();
    date.setHours(date.getHours()+9);
    const result = await pool.query(
      `UPDATE debates SET done_or_not = 1, done_at = ? WHERE id = ?`,
      [date.toISOString().slice(0, 19).replace('T', ' '), id]
    );
    return result;
  }
};

module.exports = {Debate, History, getIdByTitle};