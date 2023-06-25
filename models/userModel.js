const pool = require("../config/db.js");

class User {
  constructor(user) {
    this.id = user.id;
    this.login_id = user.login_id;
    this.name = user.name;
    this.stu_id = user.stu_id;
    this.email = user.email;
    this.phone = user.phone;
    this.password = user.password;
    this.nickname = user.nickname;
    this.rep_badge = user.rep_badge;
    this.created_at = user.created_at;
    this.point = user.point;
    this.is_admin = user.is_admin;
    this.restrict_period = user.restrict_period;
    this.restrict_count = user.restrict_count;
    this.uuid = user.uuid;
    this.is_deleted = user.is_deleted;
  }
}

//login_id로 유저 찾기
User.findByLoginId = async (login_id) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE login_id = ?`, [
    login_id,
  ]);
  console.log("🚀 ~ file: userModel.js:28 ~ User.findByLoginId= ~ rows:", rows);

  return rows;
};
//nickname으로 유저 찾기
User.findByNickname = async (nickname) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE nickname = ?`, [
    nickname,
  ]);
  return rows;
};
//email로 유저 찾기
User.findByEmail = async (email) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows;
};

//#TODO:변수 전달 방식에서 개선의 여지가 있음
User.create = async (newUser) => {
  const [rows] = await pool.query(
    `INSERT INTO users  (login_id, name, stu_id, email, password, nickname, uuid) values (?, ?, ?, ?, ?, ?, ?)`,
    [
      newUser.login_id,
      newUser.name,
      newUser.stu_id,
      newUser.email,
      newUser.password,
      newUser.nickname,
      newUser.uuid,
    ]
  );

  return rows;
};

/* User.changePW = async (password, user_id, phone_number) => {
  const [rows] = await pool.query(`UPDATE users SET password = ? WHERE login_id = ?`, [password, login_id]);
  return rows;
}
 */

/* User.wikiHistory = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM wiki_history WHERE editor_id = ?",
    [user_id]
  );

  return rows;
}; */

/* 
User.setConstraint = async (user_id) => {
  const [rows] = await pool.query("SELECT * FROM USERS WHERE user_id = ?", [
    user_id,
  ]);
  //유저가 bad가 아니라면 bad를 1로 변경후 true를 반환
  if (rows[0].bad == 0) {
    const [rows] = await pool.query(
      "UPDATE users SET bad = 1 WHERE user_id = ?",
      [user_id]
    );
    return true;
  }
  // 유저가 bad라면 bad를 0으로 변경후 false 반환
  else {
    const [rows] = await pool.query(
      "UPDATE users SET bad = 0 WHERE user_id = ?",
      [user_id]
    );
    return false;
  }
}; */

module.exports = User;
