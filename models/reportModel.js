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
  const result = await pool.query(
    `UPDATE reports SET is_checked = ? WHERE id = ?`,
    [is_checked, report_id]
  );
  return result;
};

module.exports = Report;