const pool = require("../config/db.js");

// questions 테이블의 column을 가지는 객체
const Question = function (question)  {
  this.doc_id = question.doc_id;
  this.user_id = question.user_id;
  this.index_title = question.index_title;
  this.content = question.content;
};

async function getQuestion(id) {
  const [rows] = await pool.query(
    `SELECT * FROM questions WHERE id = ?`,
    [id]
  );
  return rows[0];
}

Question.createQuestion = async (newQuestion) => {
  const [result] = await pool.query(
    `INSERT INTO questions SET ?`,
    newQuestion
  );
  const id = result.insertId;
  return getQuestion(id);
};

Question.getQuestionsAll = async (title) => {
  const rows = await pool.query(
    `SELECT * FROM questions WHERE index_title = ?`,
    [title]
  );
  return rows[0];
};

Question.likeQuestion = async (id, user_id) => {
  const flag = await pool.query(
    `SELECT * FROM question_like WHERE id = ?  AND user_id = ?`,
    [id, user_id]
  );
  if (flag[0].length) {
    return 0;
  } else {
    const result = await pool.query(
      `INSERT INTO question_like (id, user_id) VALUES (?, ?)`,
      [id, user_id]
    );
    return result;
  }
};

module.exports = Question;

//Question.updateQuestion = async () => {
//  const [result] = await pool.query(
//    `UPDATE `
//  )
//}
