const pool = require("../config/db.js");

async function postSearch(user_id, keyword) {
  const isOften = await pool.query(
    `SELECT * FROM search_history 
    WHERE user_id = ? AND keyword = ? 
    AND TIMESTAMPDIFF(MINUTE, search_time, NOW()) <= 10`,
    [user_id, keyword]
  );

  if (isOften[0].length) {
    return;
  } else {
    const result = await pool.query(
      `INSERT INTO search_history (user_id, keyword) VALUES (?, ?)`,
      [user_id, keyword]
    );
    return result;
  }
}

async function getKeywordRank() {
  const [rows] = await pool.query(
    `SELECT keyword, COUNT(*) as count 
     FROM search_history
     WHERE TIMESTAMPDIFF(DAY, search_time, NOW()) <= 30
     GROUP BY keyword 
     ORDER BY count DESC 
     LIMIT 12`
  );
  return rows;
}

module.exports = { postSearch, getKeywordRank };
