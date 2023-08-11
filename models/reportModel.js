const pool = require("../config/db.js");
const { Wiki_point } = require("../models/wikiModel.js");

// reports 테이블의 column을 가지는 객체
const Report = function (report) {
  this.user_id = report.user_id;
  this.type_id = report.type_id;
  this.target = report.target;
  this.reason_id = report.reason_id;
};

async function getReport(id) {
  const [rows] = await pool.query(`SELECT * FROM reports WHERE id = ?`, [id]);
  return rows;
}

Report.getAllReport = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM reports ORDER BY created_at DESC `
  );
  return rows;
};

Report.createReport = async (newReport) => {
  const result = await pool.query(`INSERT INTO reports SET ?`, newReport);
  const id = result[0].insertId;
  return getReport(id);
};

Report.checkReport = async (report_id, is_checked) => {
  if (is_checked == 1) {
    const report = await getReport(report_id);
    const type_id = report[0].type_id;
    const target = report[0].target;
    const user_id = report[0].user_id;
    let sql, result;

    switch (type_id) {
    case 1: {
      await pool.query(`UPDATE wiki_history SET is_bad = 1 WHERE id = ?`, [
        target,
      ]);
      const [rows] = await pool.query(
        `SELECT user_id FROM wiki_history WHERE id = ?`,
        [user_id]
      );
      await Wiki_point.recalculatePoint(rows[0].user_id);
      break;
    }
    case 2: {
      await pool.query(`UPDATE questions SET is_bad = 1 WHERE id = ?`, [
        target,
      ]);
      break;
    }
    case 3: {
      await pool.query(`UPDATE debates SET is_bad = 1 WHERE id = ?`, [
        target,
      ]);
      break;
    }
    case 4: {
      await pool.query(`UPDATE debate_history SET is_bad = 1 WHERE id = ?`, [
        target,
      ]);
      break;
    }
    default:
      break;
    }

    // report_type에 대응하는 user_action 테이블의 컬럼 재계산
    switch (type_id) {
    case 1:
      sql =
        "UPDATE user_action SET record_count = (SELECT SUM(CASE WHEN diff > 0 THEN diff ELSE 0 END) FROM wiki_history WHERE user_id = ? AND is_bad = 0 AND is_rollback = 0), revise_count = (SELECT COUNT(*) FROM wiki_history WHERE user_id = ? AND is_bad = 0), answer_count = (SELECT COUNT(*) FROM wiki_history WHERE user_id = ? AND is_q_based = 1 AND is_bad = 0) WHERE user_id = ?";
      await pool.query(sql, [user_id, user_id, user_id, user_id]);
      break;
    case 2:
      sql =
        "UPDATE user_action SET question_count = (SELECT COUNT(*) FROM questions WHERE user_id = ? AND is_bad = 0) WHERE user_id = ?";
      await pool.query(sql, [user_id, user_id]);
      break;
    case 4:
      sql =
        "UPDATE user_action SET debate_count = (SELECT COUNT(*) FROM debate_history WHERE user_id = ? AND is_bad = 0) WHERE user_id = ?";
      await pool.query(sql, [user_id, user_id]);
      break;
    default:
      break;
    }

    // 재계산된 카운트가 현재 부여된 뱃지의 기준을 충족하지 않을 경우, 해당하는 badge_history의 is_bad 컬럼을 1로 만듦
    sql = "SELECT badge_id FROM badge_history WHERE user_id = ? AND is_bad = 0";
    result = await pool.query(sql, [user_id]);
    const badge_ids = result[0].map((row) => row.badge_id);

    sql = "SELECT * FROM user_action WHERE user_id = ?";
    result = await pool.query(sql, [user_id]);
    const user_action = result[0][0];

    for (const badge_id of badge_ids) {
      switch (type_id) {
      case 1:
        if (
          (badge_id === 3 && user_action.record_count < 100) ||
          (badge_id === 4 && user_action.record_count < 1000) ||
          (badge_id === 5 && user_action.record_count < 2500) ||
          (badge_id === 6 && user_action.record_count < 5000) ||
          (badge_id === 7 && user_action.record_count < 10000) ||
          (badge_id === 8 && user_action.revise_count < 1) ||
          (badge_id === 9 && user_action.revise_count < 3) ||
          (badge_id === 10 && user_action.revise_count < 10) ||
          (badge_id === 11 && user_action.revise_count < 20) ||
          (badge_id === 27 && user_action.answer_count < 1) ||
          (badge_id === 28 && user_action.answer_count < 30) ||
          (badge_id === 29 && user_action.answer_count < 100) ||
          (badge_id === 30 && user_action.answer_count < 200)
        ) {
          sql =
            "UPDATE badge_history SET is_bad = 1 WHERE user_id = ? AND badge_id = ?";
          await pool.query(sql, [user_id, badge_id]);
        }
        break;
      case 2:
        if (
          (badge_id === 24 && user_action.question_count < 1) ||
          (badge_id === 25 && user_action.question_count < 10) ||
          (badge_id === 26 && user_action.question_count < 30)
        ) {
          sql =
            "UPDATE badge_history SET is_bad = 1 WHERE user_id = ? AND badge_id = ?";
          await pool.query(sql, [user_id, badge_id]);
        }
        break;
      case 4:
        if (
          (badge_id === 21 && user_action.debate_count < 1) ||
          (badge_id === 22 && user_action.debate_count < 10) ||
          (badge_id === 23 && user_action.debate_count < 30)
        ) {
          sql =
            "UPDATE badge_history SET is_bad = 1 WHERE user_id = ? AND badge_id = ?";
          await pool.query(sql, [user_id, badge_id]);
        }
        break;
      default:
        break;
      }
    }
  }

  const result = await pool.query(
    `UPDATE reports SET is_checked = ? WHERE id = ?`,
    [is_checked, report_id]
  );
  return result;
};

module.exports = { Report, getReport };
