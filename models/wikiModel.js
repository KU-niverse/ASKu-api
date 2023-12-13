const pool = require("../config/db.js");

// wiki_docs 테이블의 column을 가지는 객체
class Wiki_docs {
  constructor(wiki_docs) {
    this.title = wiki_docs.title;
    this.text_pointer = wiki_docs.text_pointer;
    this.recent_filtered_content = wiki_docs.recent_filtered_content;
    this.type = wiki_docs.type;
    this.latest_ver = wiki_docs.latest_ver;
    this.is_managed = wiki_docs.is_managed || 0;
  }
  // wiki_docs 테이블에 새로운 문서를 생성해주는 함수
  static async create(new_wiki_docs) {
    const [result] = await pool.query(
      "INSERT INTO wiki_docs SET ?",
      new_wiki_docs
    );
    const id = result.insertId;

    return Wiki_docs.getWikiDocsById(id);
  }
  // wiki_docs 테이블에서 id를 통해 문서를 찾아주는 함수
  static async getWikiDocsById(id) {
    const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE id = ?`, [
      id,
    ]);

    return rows[0];
  }
  // is_deleted가 0인 모든 문서 제목 가져오기
  static async getAllWikiDocs() {
    const [rows] = await pool.query(
      `SELECT title FROM wiki_docs WHERE is_deleted = 0`
    );

    return rows.map((rows) => rows.title);
  }
  // is_deleted가 0인 문서 중 랜덤으로 제목 하나 가져오기
  static async getRandomWikiDocs() {
    const [rows] = await pool.query(
      `SELECT title FROM wiki_docs WHERE is_deleted = 0 ORDER BY RAND() LIMIT 1`
    );

    return rows[0].title;
  }
  // wiki_docs 테이블에서 id를 통해 문서를 지워주는 함수(is_deleted = 1로 업데이트)
  static async deleteWikiDocsById(id) {
    const [result] = await pool.query(
      `UPDATE wiki_docs SET is_deleted = 1 WHERE id = ?`,
      [id]
    );

    return result[0].changedRows;
  }
  // wiki_docs 테이블에서 title을 통해 문서의 id를 찾아주는 함수
  static async getWikiDocsIdByTitle(title) {
    const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE title = ?`, [
      title,
    ]);

    if (rows.length == 0) {
      return null;
    }

    return rows[0].id;
  }
  //wiki_docs 테이블에서 title을 통해 문서를 찾아주는 함수
  static async getWikiDocsByTitle(title) {
    const [rows] = await pool.query(`SELECT * FROM wiki_docs WHERE title = ?`, [
      title,
    ]);
    if (rows.length == 0) {
      return null;
    }
    return rows[0];
  }

  // wiki_docs 테이블에서 title을 통해 like 기반으로 문서를 찾아주는 함수, 나중에 업데이트 예정
  static async searchWikiDocsByTitle(title, user_id) {
    const [rows] = await pool.query(
      `
      SELECT wiki_docs.*, IF(wiki_favorites.user_id IS NOT NULL, 1, 0) AS is_favorite
      FROM wiki_docs
      LEFT JOIN (
          SELECT user_id, doc_id
          FROM wiki_favorites
          WHERE user_id = ?  -- 여기에 현재 사용자의 ID를 삽입
      ) AS wiki_favorites
      ON wiki_docs.id = wiki_favorites.doc_id
      WHERE wiki_docs.title LIKE ?;
      `,
      [user_id, `%${title}%`]
    );

    return rows;
  }

  // admin-wiki_docs 테이블에서 최근에 생긴 wiki_docs부터 반환해주는 함수
  static async getAllDoc() {
    const [rows] = await pool.query(
      `SELECT * FROM wiki_docs WHERE is_deleted = 0 ORDER BY created_at DESC`
    );

    return rows;
  }

  static async updateRecentContent(doc_id, text) {
    // 위키 문법 필터링
    text = text.replace(/\n([^=].*?)\n/g, "$1 ");
    text = text.replace(/'''([^=].*?)'''/g, "$1");
    text = text.replace(/''(.+?)''/g, "$1");
    text = text.replace(/--(.+?)--/g, "$1");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/={2,}/g, "");
    text = text.replace(/={2,}/g, "");
    text = text.replace(/\n/g, " ");
    text = text.replace(/\n/g, " ");
    text = text.replace(/\[\[.*http.*\]\]/g, ""); // Remove [[...http...]]
    text = text.replace(/\[\[(.+?)\]\]/g, "$1"); // Remove brackets from [[...]]

    // 필터링 한 내용을 recent_filtered_content에 업데이트
    const [result] = await pool.query(
      `UPDATE wiki_docs SET recent_filtered_content = ? WHERE id = ?`,
      [text, doc_id]
    );

    return result.changedRows;
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
    this.is_q_based = wiki_history.is_q_based;
    this.is_rollback = wiki_history.is_rollback;
    this.index_title = wiki_history.index_title;
  }

  // wiki_history 내림차순으로 정렬해서 반환해주는 함수(doc_id로)
  static async getWikiHistorysById(doc_id) {
    const [rows] = await pool.query(
      `SELECT wh.*, u.nickname AS nick
      FROM wiki_history wh
      JOIN users u ON wh.user_id = u.id
      WHERE wh.doc_id = ?
      ORDER BY wh.created_at DESC`,
      [doc_id]
    );
    return rows;
  }
  // 가장 최근에 수정된 wiki_history를 반환해주는 함수(doc_id로)
  static async getRecentWikiHistoryByDocId(doc_id) {
    const [rows] = await pool.query(
      "SELECT * FROM wiki_history WHERE doc_id = ? ORDER BY created_at DESC LIMIT 1",
      [doc_id]
    );
    return rows;
  }

  // 최근에 수정된 wiki_history들을 반환해주는 함수
  static async getRecentWikiHistorys(type) {
    const [rows] = await pool.query(
      `
    SELECT
      wh.id,
      wh.user_id,
      wh.doc_id,
      wh.version,
      wh.summary,
      wh.created_at,
      wh.diff,
      wh.is_rollback,
      wd.title AS doc_title,
      u.nickname AS nick
    FROM wiki_history wh
    JOIN wiki_docs wd ON wh.doc_id = wd.id
    JOIN users u ON wh.user_id = u.id
    WHERE
      (CASE
        WHEN ? = 'create' THEN wh.version = 1
        WHEN ? = 'rollback' THEN wh.is_rollback = 1
        ELSE true
      END)
    ORDER BY wh.created_at DESC
    LIMIT 30`,
      [type, type]
    );

    return rows;
  }

  // doc id, history version 넣어주면 해당 wiki_history를 반환해주는 함수
  // 사용 안 되면 삭제 예정
  static async getWikiHistoryByVersion(doc_id, version) {
    const [rows] = await pool.query(
      `SELECT * FROM wiki_history WHERE doc_id = ? AND version = ?`,
      [doc_id, version]
    );

    return rows[0];
  }

  // 부적절한 wiki_history is_bad = 1로 업데이트해주는 함수, 이때 작성한 유저의 기여도와 action record_count도 재계산해준다.
  static async badHistoryById(id) {
    const [result] = await pool.query(
      `UPDATE wiki_history SET is_bad = 1 WHERE id = ?`,
      [id]
    );

    const [rows] = await pool.query(
      `SELECT user_id FROM wiki_history WHERE id = ?`,
      [id]
    );
    await Wiki_point.recalculatePoint(rows[0].user_id);

    return result.changedRows;
  }

  // 답변 생성하는 함수, 질문 기반 수정일 때만 사용
  static async createAnswer(wiki_history_id, qid) {
    const [rows] = await pool.query(
      `INSERT INTO answers SET wiki_history_id = ?, question_id = ?`,
      [wiki_history_id, qid]
    );
    const answer_id = rows.insertId;

    // questions의 answer_or_not 업데이트
    await pool.query(`UPDATE questions SET answer_or_not = 1 WHERE id = ?`, [
      qid,
    ]);

    return answer_id;
  }

  // 새로운 wiki_history를 생성해주는 함수, wiki_docs의 text_pointer와 lastest_ver도 업데이트해준다.
  static async create(new_wiki_history) {
    const [result] = await pool.query(
      "INSERT INTO wiki_history SET ?",
      new_wiki_history
    );
    await pool.query(
      "UPDATE wiki_docs SET text_pointer = ?, latest_ver = ? WHERE id = ?",
      [
        new_wiki_history.text_pointer,
        new_wiki_history.version,
        new_wiki_history.doc_id,
      ]
    );
    const wiki_history_id = result.insertId;

    return wiki_history_id;
  }
  //admin 위키 히스토리 조회
  static async getAllWikiHistory() {
    const [rows] = await pool.query(
      `SELECT * FROM wiki_history ORDER BY created_at DESC`
    );
    return rows;
  }
}

// 기여도 관련 함수들을 가지는 객체
class Wiki_point {
  // 기여도를 지급해주는 함수 (그냥 위키 수정 diff * 4, 질문 기반 작성일 시 diff * 5)
  static async givePoint(user_id, point, is_q_based) {
    if (point <= 0) {
      return;
    }
    if (is_q_based == 1) {
      point = point * 5;
    } else {
      point = point * 4;
    }
    const [rows] = await pool.query(
      "UPDATE users SET point = point + ? WHERE id = ?",
      [point, user_id]
    );
    return rows.affectedRows;
  }

  // 기여도를 user의 wiki_history 기반으로 재계산 해주는 함수
  static async recalculatePoint(user_id) {
    // 기여도 재계산
    const [result] = await pool.query(
      "UPDATE users SET point = (SELECT SUM(CASE WHEN diff > 0 AND is_q_based = 1 THEN diff * 5 WHEN diff > 0 THEN diff * 4 ELSE 0 END) FROM wiki_history WHERE user_id = ? AND is_bad = 0 AND is_rollback = 0) WHERE id = ?",
      [user_id, user_id]
    );
    return result.affectedRows;
  }

  // 현재 문서에 기여한 유저와 기여도를 반환해주는 함수
  static async getContributors(doc_id) {
    const [rows] = await pool.query(
      `
      SELECT
        wh.user_id,
        u.nickname,
        SUM(
            CASE
                WHEN wh.diff > 0 AND wh.is_q_based = 1 THEN wh.diff * 5
                WHEN wh.diff > 0 THEN wh.diff * 4
                ELSE 0
            END
        ) AS point
      FROM wiki_history wh
      JOIN users u ON wh.user_id = u.id
      WHERE wh.doc_id = ? AND wh.is_bad = 0 AND wh.is_rollback = 0
      GROUP BY wh.user_id, u.nickname
      ORDER BY point DESC;
    `,
      [doc_id]
    );
    return rows;
  }

  // 유저 기여도 전체 순위를 반환해주는 함수
  static async getRanking() {
    const [rows] = await pool.query(
      "SELECT id as user_id, login_id, nickname, point FROM users WHERE is_deleted = 0 ORDER BY point DESC"
    );

    return rows;
  }

  // 유저 id 넣어주면 전체 유저의 수와 해당 유저의 기여도 순위를 반환해주는 함수
  static async getRankingById(user_id) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM users WHERE is_deleted = 0"
    );
    const [rows2] = await pool.query(
      `SELECT
        (SELECT COUNT(*) + 1 FROM users WHERE users.point > (SELECT point FROM users WHERE id = ?)) AS ranking,
        (SELECT point FROM users WHERE id = ?) AS user_point`,
      [user_id, user_id]
    );

    const totalUsers = rows[0].count;
    const userRanking = rows2[0].ranking;
    const userPoint = rows2[0].user_point;

    const ranking_percentage = (userRanking / totalUsers) * 100;
    if (userPoint == 0) {
      return {
        count: totalUsers,
        ranking: userRanking,
        point: userPoint,
        ranking_percentage: 100,
      };
    }

    return {
      count: totalUsers,
      ranking: userRanking,
      point: userPoint,
      ranking_percentage: ranking_percentage,
    };
  }

  static async getDocsContributions(user_id) {
    const [rows] = await pool.query(
      `
    SELECT
      wh.doc_id,
      wd.title AS doc_title,
      SUM(CASE WHEN wh.diff > 0 THEN CASE WHEN wh.is_q_based = 1 THEN wh.diff * 5 ELSE wh.diff * 4 END ELSE 0 END) AS doc_point,
      (SUM(CASE WHEN wh.diff > 0 THEN CASE WHEN wh.is_q_based = 1 THEN wh.diff * 5 ELSE wh.diff * 4 END ELSE 0 END) / 
        (SELECT SUM(CASE WHEN diff > 0 THEN CASE WHEN is_q_based = 1 THEN diff * 5 ELSE diff * 4 END ELSE 0 END) 
        FROM wiki_history 
        WHERE is_bad = 0 AND is_rollback = 0)
      ) * 100 AS percentage
    FROM wiki_history wh
    JOIN wiki_docs wd ON wd.id = wh.doc_id
    WHERE wh.user_id = ? AND wh.is_bad = 0 AND wh.is_rollback = 0
    GROUP BY wh.doc_id
    ORDER BY percentage DESC`,
      [user_id]
    );

    return rows;
  }
}

// 위키 즐겨찾기
class Wiki_favorite {
  constructor(wiki_favorite) {
    this.doc_id = wiki_favorite.doc_id;
    this.user_id = wiki_favorite.user_id;
  }

  // 위키 즐겨찾기 추가
  static async create(new_wiki_favorite) {
    // 이미 즐겨찾기에 추가되어 있는지 확인
    const [rows] = await pool.query(
      `SELECT * FROM wiki_favorites WHERE doc_id = ? AND user_id = ?`,
      [new_wiki_favorite.doc_id, new_wiki_favorite.user_id]
    );
    // 즐겨찾기에 추가되어 있지 않다면
    if (rows.length == 0) {
      const [result] = await pool.query(
        "INSERT INTO wiki_favorites SET ?",
        new_wiki_favorite
      );

      return result.insertId;
    } else {
      return 0;
    }
  }

  // 위키 즐겨찾기 삭제
  static async deleteWikiFavorite(doc_id, user_id) {
    const [result] = await pool.query(
      `DELETE FROM wiki_favorites WHERE doc_id = ? AND user_id = ?`,
      [doc_id, user_id]
    );
    if (result.affectedRows == 0) {
      return 0;
    }
    return result.changedRows;
  }

  // user_id로 위키 즐겨찾기 조회
  static async getWikiFavoriteByUserId(user_id) {
    const [rows] = await pool.query(
      `SELECT wd.*
      FROM wiki_favorites wf
      JOIN wiki_docs wd ON wf.doc_id = wd.id
      WHERE wf.user_id = ?
      ORDER BY wf.created_at DESC`,
      [user_id]
    );

    return rows;
  }

  // user_id와 doc_id로 위키 즐겨찾기 조회
  static async getWikiFavoriteByUserIdAndDocId(user_id, doc_id) {
    const [rows] = await pool.query(
      `SELECT wd.*
      FROM wiki_favorites wf
      JOIN wiki_docs wd ON wf.doc_id = wd.id
      WHERE wf.user_id = ? AND wf.doc_id = ?
      ORDER BY wf.created_at DESC`,
      [user_id, doc_id]
    );

    return rows;
  }
}

module.exports = { Wiki_history, Wiki_docs, Wiki_point, Wiki_favorite };
