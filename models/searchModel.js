const pool = require("../config/db.js");

async function postSearch(user_id, keyword) {
  const result = await pool.query(
    `INSERT INTO search_history (user_id, keyword) VALUES (?, ?)`,
    [user_id, keyword]
  );
  return result;
}

async function getKeywordRank() {
  const [rows] = await pool.query(
    `SELECT keyword, COUNT(*) as count 
     FROM search_history
     WHERE TIMESTAMPDIFF(HOUR, search_time, NOW()) <= 24
     GROUP BY keyword 
     ORDER BY count DESC 
     LIMIT 5`
  );
  return rows;
}

module.exports = {postSearch, getKeywordRank};