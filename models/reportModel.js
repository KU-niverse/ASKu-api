const pool = require("../config/db.js");

// reports 테이블의 column을 가지는 객체
const Report = function (report) {
  this.user_id = report.user_id;
  this.type_id = report.type_id;
  this.target = report.target;
  this.reason_id = report.reason_id;
  this.comment = report.comment;
};

async function getReport(id) {
  const [rows] = await pool.query(
    `SELECT * FROM reports WHERE id = ?`,
    [id]
  );
  return rows;
}

Report.createReport = async (newReport) => {
  const result = await pool.query(
    `INSERT INTO reports SET ?`,
    newReport
  );
  const id = result[0].insertId;
  return getReport(id);
};

Report.checkReport = async (report_id, is_checked) => {
  if (is_checked == 1) {
    const report = await getReport(report_id);
    const type_id = report[0].type_id;
    const target = report[0].target;
    switch (type_id) {
    case 1:
      await pool.query(
        `UPDATE wiki_history SET is_bad = 1 WHERE id = ?`,
        [target]
      );
      break;
    case 2:
      await pool.query(
        `UPDATE questions SET is_bad = 1 WHERE id = ?`,
        [target]
      );
      break;
    case 3:
      await pool.query(
        `UPDATE debates SET is_bad = 1 WHERE id = ?`,
        [target]
      );
      break;
    case 4:
      await pool.query(
        `UPDATE debate_history SET is_bad = 1 WHERE id = ?`,
        [target]
      );
      break;
    default:
      break;
    }
  } 
  const result = await pool.query(
    `UPDATE reports SET is_checked = ? WHERE id = ?`,
    [is_checked, report_id]
  );
  return result;
};

module.exports = {Report, getReport};