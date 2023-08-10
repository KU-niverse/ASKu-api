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

// wiki_docs의 title을 입력하면 해당 문서의 id 반환하는 함수
async function getIdByTitle(title) {
  const result = await pool.query(
    `SELECT id FROM wiki_docs WHERE title = ?`,
    [title]
  );
  return result[0][0].id;
}

Question.createQuestion = async (newQuestion) => {
  const [result] = await pool.query(
    `INSERT INTO questions SET ?`,
    newQuestion
  );
  const id = result.insertId;
  return getQuestion(id);
};

Question.getQuestionsAll = async (id, flag) => {
  if (flag == 0) {
    const rows = await pool.query(
      `SELECT questions.*, users.nickname, COUNT(question_like.id) AS like_count
      FROM questions 
      INNER JOIN users ON questions.user_id = users.id
      LEFT JOIN question_like ON questions.id = question_like.id
      WHERE questions.doc_id = ?
      GROUP BY questions.id
      ORDER BY questions.created_at DESC`,
      [id]
    );
    return rows[0];
  } if (flag == 1) {
    const rows = await pool.query(
      `SELECT questions.*, users.nickname, COUNT(question_like.id) AS like_count
      FROM questions
      INNER JOIN users ON questions.user_id = users.id
      LEFT JOIN question_like ON questions.id = question_like.id
      WHERE questions.doc_id = ?
      GROUP BY questions.id
      ORDER BY like_count DESC, questions.created_at DESC`,
      [id]
    );
    return rows[0];
  } else {
    return 0;
  }
};

Question.updateQuestion = async (question_id, user_id, new_content) => {
  const flag = await pool.query(
    `SELECT user_id, answer_or_not FROM questions WHERE id = ?`,
    [question_id]
  );
  if (!flag[0][0].answer_or_not && flag[0][0].user_id == user_id) {
    const result = await pool.query(
      `UPDATE questions SET content = ? WHERE id = ?`,
      [new_content, question_id]
    );
    return result;
  } else {
    return 0;
  }
};

Question.deleteQuestion = async (question_id, user_id) => {
  const flag = await pool.query(
    `SELECT user_id, answer_or_not FROM questions WHERE id = ?`,
    [question_id]
  );
  const flag_like = await pool.query(
    `SELECT id FROM question_like WHERE id = ?`,
    [question_id]
  );
  if (!flag[0][0].answer_or_not && !flag_like[0][0] && flag[0][0].user_id == user_id) {
    const result = await pool.query(
      `DELETE FROM questions WHERE id = ?`,
      [question_id]
    );
    return result;
  } else {
    return 0;
  }
};

Question.likeQuestion = async (id, user_id) => {
  const flag_writer = await pool.query(
    `SELECT user_id FROM questions WHERE id = ?`,
    [id]
  );
  const flag_like = await pool.query(
    `SELECT * FROM question_like WHERE id = ?  AND user_id = ?`,
    [id, user_id]
  );
  if (flag_like[0].length) {
    return 0;
  } else if (flag_writer[0][0].user_id == user_id){
    return -1;
  } else {
    const result = await pool.query(
      `INSERT INTO question_like (id, user_id) VALUES (?, ?)`,
      [id, user_id]
    );
    return result;
  }
};

Question.getQuestionSearchByQuery = async (query) => {
  const result = await pool.query(`SELECT * FROM questions WHERE content LIKE ?`, [`%${query}%`]);
  return result[0];
};

Question.getQuestionsPopular = async () => {
  const rows = await pool.query(
    `SELECT q.id, q.doc_id, q.user_id, q.index_title, q.content, q.created_at, q.answer_or_not, q.is_bad, COUNT(ql.id) AS like_count
    FROM questions q
    LEFT JOIN question_like ql ON q.id = ql.id
    WHERE q.answer_or_not = 0
    GROUP BY q.id
    ORDER BY like_count DESC
    LIMIT 5;`
  );
  return rows[0];
};

module.exports = {Question, getIdByTitle, getQuestion};