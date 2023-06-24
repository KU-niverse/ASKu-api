// const pool = require("../config/db.js")

// // wiki_history 테이블의 column을 가지는 객체
// const Wiki_history = function (wiki_history) {
//     this.editor_id = wiki_history.editor_id;
//     this.text_pointer = wiki_history.text_pointer;
//     this.is_rollback = wiki_history.is_rollback;
//     //this.content_summary = wiki.content_summary;
// }

// // id 넣어주면 해당 id의 wiki_history를 반환해주는 함수
// Wiki_history.getWiki_history = async (id) => {
//     const [rows] = await pool.query(`SELECT * FROM wiki_history WHERE wiki_history_id = ?`, [id]);

//     return rows[0];
// }

// // 새로운 wiki_history를 생성해주는 함수
// Wiki_history.create = async (newWiki_history) => {
//     const [result] = await pool.query("INSERT INTO wiki_history SET ?", newWiki_history);
//     const id = result.insertId;

//     return Wiki_history.getWiki_history(id);
// }

// // wiki_history 내림차순으로 정렬해서 반환해주는 함수
// Wiki_history.read = async () => {
//     const [rows] = await pool.query("SELECT * FROM wiki_history ORDER BY edited_time DESC");
//     return rows;
// };

// // 가장 최근에 수정된 wiki_history를 반환해주는 함수
// Wiki_history.readRecent = async () => {
//     const [rows] = await pool.query("SELECT * FROM wiki_history ORDER BY edited_time DESC LIMIT 1");
//     return rows
// };

// module.exports = Wiki_history;