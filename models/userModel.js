const pool = require("../config/db.js");

class User {
  constructor(user) {
    this.id = user.id;
    this.login_id = user.login_id;
    this.name = user.name;
    this.stu_id = user.stu_id;
    this.email = user.email;
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

//temp에서 login_id로 유저 찾기
User.findByLoginIdTemp = async (login_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM temp_users WHERE login_id = ?`,
    [login_id]
  );
  return rows;
};

//temp에서 nickname으로 유저 찾기
User.findByNicknameTemp = async (nickname) => {
  const [rows] = await pool.query(
    `SELECT * FROM temp_users WHERE nickname = ?`,
    [nickname]
  );
  return rows;
};
//temp에서 email로 유저 찾기
User.findByEmailTemp = async (email) => {
  const [rows] = await pool.query(`SELECT * FROM temp_users WHERE email = ?`, [
    email,
  ]);

  return rows;
};

//user_id로 유저 찾기
User.findById = async (id) => {
  const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return user;
};

//login_id로 유저 찾기
User.findByLoginId = async (login_id) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE login_id = ?`, [
    login_id,
  ]);
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
    `INSERT INTO users  (login_id, name, stu_id, email, password, nickname, uuid) values (?, ?, ?, ?, ?, ?, ?);`,
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
//이메일 인증 전 임시 유저 생성
User.tempCreate = async (newUser) => {
  const [dup_user] = await pool.query(
    `SELECT * FROM users where login_id = ? or email = ? or nickname = ?`,
    [newUser.login_id, newUser.email, newUser.nickname]
  );
  if (dup_user.length > 0) {
    console.log("중복된 항목이 있습니다.");
    return false;
  }
  await pool.query(
    `INSERT INTO temp_users  (login_id, name, stu_id, email, password, nickname, uuid, auth_uuid) values (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      newUser.login_id,
      newUser.name,
      newUser.stu_id,
      newUser.email,
      newUser.password,
      newUser.nickname,
      newUser.uuid,
      newUser.auth_uuid,
    ]
  );
  return true;
};

//비밀번호 변경
User.changePw = async (login_id, hashed_new_pw) => {
  await pool.query(`UPDATE users SET password = ? WHERE login_id = ?;`, [
    hashed_new_pw,
    login_id,
  ]);
  return true;
};

//회원가입 이메일 인증
User.register_auth = async (auth_uuid) => {
  //temporary_user에 현재 해당 auth_uuid 존재하는지 확인
  const [temp_user] = await pool.query(
    `SELECT * FROM temp_users WHERE auth_uuid = ?;`,
    [auth_uuid]
  );
  if (temp_user.length == 1) {
    await User.create(temp_user[0]);
    await pool.query(`DELETE FROM temp_users WHERE auth_uuid = ?;`, [
      auth_uuid,
    ]);
    return true;
  } else {
    console.log("해당 회원가입의 세션이 만료되었습니다.");
    return false;
  }
};

User.createChangePwSession = async (login_id, hashed_login_id) => {
  const [user] = await pool.query(`SELECT * FROM users WHERE login_id = ?`, [
    login_id,
  ]);
  await pool.query(
    `INSERT INTO change_pw_session (user_id, change_pw_token) VALUES (?, ?)`,
    [user[0].id, hashed_login_id]
  );
  return true;
};

User.checkPwChangeSession = async (hashed_login_id) => {
  const [pw_session] = await pool.query(
    `SELECT * FROM change_pw_session WHERE change_pw_token = ?`,
    [hashed_login_id]
  );
  return pw_session;
};

User.deletePwFindSession = async (hashed_login_id) => {
  await pool.query(`DELETE FROM change_pw_session WHERE change_pw_token = ?`, [
    hashed_login_id,
  ]);
  return true;
};

//user mypage models

User.getWikiHistory = async (user_id) => {
  const [user_wiki_history] = await pool.query(
    `SELECT * FROM wiki_history WHERE user_id = ?`,
    [user_id]
  );
  return user_wiki_history;
};

User.getBadgeHistory = async (user_id) => {
  const [user_badge_history] = await pool.query(
    `SELECT * FROM badge_history WHERE user_id = ?`,
    [user_id]
  );
  return user_badge_history;
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
