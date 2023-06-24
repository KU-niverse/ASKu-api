const pool = require("../config/db.js");

// wiki_docs 테이블의 column을 가지는 객체
const Wiki_docs = function (wiki_docs) {
  this.title = wiki_docs.title;
  this.text_pointer = wiki_docs.text_pointer;
  this.type = wiki_docs.type;
  this.latest_ver = wiki_docs.latest_ver;
};

// wiki_history 테이블의 column을 가지는 객체
const Wiki_history = function (wiki_history) {
  this.user_id = wiki_history.user_id;
  this.doc_id = wiki_history.doc_id;
  this.text_pointer = wiki_history.text_pointer;
  this.summary = wiki_history.summary;
  this.count = wiki_history.count;
  this.diff = wiki_history.diff;
  this.version = wiki_history.version;
};

// wiki_docs 테이블에 새로운 문서를 생성해주는 함수
Wiki_docs.create = async (newWiki_docs) => {
  const [result] = await pool.query("INSERT INTO wiki_docs SET ?", newWiki_docs);
  const id = result.insertId;

  return Wiki_docs.getWiki_docs_by_id(id);
};

// wiki_docs 테이블에서 id를 통해 문서를 찾아주는 함수
Wiki_docs.getWiki_docs_by_id = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE id = ?`, [id]);
  
  return rows[0];
};

// wiki_docs 테이블에서 title을 통해 문서의 id를 찾아주는 함수
Wiki_docs.getWiki_docs_by_title = async (title) => {
  const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE title = ?`, [title]);

  if(rows.length == 0) {
    return null;
  }

  return rows[0].id;
};

// wiki_history 내림차순으로 정렬해서 반환해주는 함수
Wiki_history.getWiki_historys_by_id = async (doc_id) => {
  const [rows] = await pool.query("SELECT * FROM wiki_history WHERE doc_id = ? ORDER BY created_at DESC", [doc_id]);
  return rows;
};

// 가장 최근에 수정된 wiki_history를 반환해주는 함수(id로)
Wiki_history.getRecent_wiki_history_by_doc_id = async (doc_id) => {
  const [rows] = await pool.query("SELECT * FROM wiki_history WHERE doc_id = ? ORDER BY created_at DESC LIMIT 1", [doc_id]);
  return rows;
};

// wiki_history 테이블에서 wiki_history_id를 통해 문서를 찾아주는 함수
Wiki_history.getWiki_history_by_wiki_history_id = async (wiki_history_id) => {
  const [rows] = await pool.query(`SELECT * FROM wiki_history WHERE id = ?`, [wiki_history_id]);

  return rows[0];
};

// doc id, history version 넣어주면 해당 wiki_history를 반환해주는 함수
Wiki_history.getWiki_history_by_version = async (doc_id, version) => {
  const [rows] = await pool.query(`SELECT * FROM wiki_history WHERE doc_id = ? AND version = ?`, [doc_id, version]);

  return rows[0];
};

// 새로운 wiki_history를 생성해주는 함수
Wiki_history.create = async (newWiki_history) => {
  const [result] = await pool.query("INSERT INTO wiki_history SET ?", newWiki_history);
  const wiki_history_id = result.insertId;

  return Wiki_history.getWiki_history_by_wiki_history_id(wiki_history_id);
};

module.exports = { Wiki_history, Wiki_docs };