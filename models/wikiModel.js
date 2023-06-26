const pool = require("../config/db.js");

// wiki_docs 테이블의 column을 가지는 객체
class Wiki_docs {
  constructor(wiki_docs) {
    this.title = wiki_docs.title;
    this.text_pointer = wiki_docs.text_pointer;
    this.type = wiki_docs.type;
    this.latest_ver = wiki_docs.latest_ver;
  }
  // wiki_docs 테이블에 새로운 문서를 생성해주는 함수
  static async create(new_wiki_docs) {
    const [result] = await pool.query("INSERT INTO wiki_docs SET ?", new_wiki_docs);
    const id = result.insertId;

    return Wiki_docs.getWikiDocsById(id);
  }
  // wiki_docs 테이블에서 id를 통해 문서를 찾아주는 함수
  static async getWikiDocsById(id) {
    const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE id = ?`, [id]);

    return rows[0];
  }
  // wiki_docs 테이블에서 title을 통해 문서의 id를 찾아주는 함수
  static async getWikiDocsIdByTitle(title) {
    const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE title = ?`, [title]);

    if (rows.length == 0) {
      return null;
    }

    return rows[0].id;
  }
}

// wiki_history 테이블의 column을 가지는 객체
class Wiki_history {
  constructor(wiki_history) {
    this.user_id = wiki_history.user_id;
    this.doc_id = wiki_history.doc_id;
    this.text_pointer = wiki_history.text_pointer;
    this.summary = wiki_history.summary;
    this.count = wiki_history.count;
    this.diff = wiki_history.diff;
    this.version = wiki_history.version;
  }
  // wiki_history 내림차순으로 정렬해서 반환해주는 함수
  static async getWikiHistorysById(doc_id) {
    const [rows] = await pool.query("SELECT * FROM wiki_history WHERE doc_id = ? ORDER BY created_at DESC", [doc_id]);
    return rows;
  }
  // 가장 최근에 수정된 wiki_history를 반환해주는 함수(doc_id로)
  static async getRecentWikiHistoryByDocId(doc_id) {
    const [rows] = await pool.query("SELECT * FROM wiki_history WHERE doc_id = ? ORDER BY created_at DESC LIMIT 1", [doc_id]);
    return rows;
  }
 
  // doc id, history version 넣어주면 해당 wiki_history를 반환해주는 함수
  static async getWikiHistoryByVersion(doc_id, version) {
    const [rows] = await pool.query(`SELECT * FROM wiki_history WHERE doc_id = ? AND version = ?`, [doc_id, version]);

    return rows[0];
  }
  // 새로운 wiki_history를 생성해주는 함수, wiki_docs의 text_pointer와 lastest_ver도 업데이트해준다.
  static async create(new_wiki_history) {
    const [result] = await pool.query("INSERT INTO wiki_history SET ?", new_wiki_history);
    await pool.query("UPDATE wiki_docs SET text_pointer = ?, latest_ver = ? WHERE id = ?", [new_wiki_history.text_pointer, new_wiki_history.version, new_wiki_history.doc_id]);
    const wiki_history_id = result.insertId;

    return Wiki_history.getWikiHistorysById(wiki_history_id);
  }
}

// 기여도 관련 함수들을 가지는 객체
class Wiki_point {
  // 기여도를 지급해주는 함수
  static async givePoint(user_id, point) {
    if(point <= 0){
      return;
    }
    await pool.query("UPDATE users SET point = point + ? WHERE id = ?", [point, user_id]);

    return;
  }

  // 기여도를 user의 wiki_history 기반으로 재계산 해주는 함수
  static async recalculatePoint(user_id) {
    const [rows] = await pool.query("SELECT * FROM wiki_history WHERE user_id = ? AND is_bad = 0", [user_id]);
    let point = 0;
    for (let i = 0; i < rows.length; i++) {
      if(rows[i].diff > 0){
        point += rows[i].diff;
      }
    }
    await pool.query("UPDATE users SET point = ? WHERE id = ?", [point, user_id]);

    return;
  }

  // 현재 문서에 기여한 유저와 기여도를 반환해주는 함수
  static async getContributors(doc_id) {
    const [rows] = await pool.query("SELECT user_id, SUM(CASE WHEN diff > 0 THEN diff ELSE 0 END) AS point FROM wiki_history WHERE doc_id = ? AND is_bad = 0 GROUP BY user_id ORDER BY point DESC", [doc_id]);
    return rows;
  }

  // 유저 기여도 순위를 반환해주는 함수
  static async getRanking() {
    const [rows] = await pool.query("SELECT id, login_id, nickname, point FROM users WHERE is_deleted = 0 ORDER BY point DESC");
    return rows;
  }
}

module.exports = { Wiki_history, Wiki_docs, Wiki_point };