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
  await pool.query(
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
  const [user] = await pool.query(`SELECT * FROM users WHERE login_id = ?`, [
    newUser.login_id,
  ]);

  return user;
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
User.changePw = async (user_id, hashed_new_pw) => {
  await pool.query(`UPDATE users SET password = ? WHERE id = ?;`, [
    hashed_new_pw,
    user_id,
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
    const [user] = await User.create(temp_user[0]);
    await pool.query(`DELETE FROM temp_users WHERE auth_uuid = ?;`, [
      auth_uuid,
    ]);
    return user.id;
  } else {
    console.log("해당 회원가입의 세션이 만료되었습니다.");
    return null;
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
    `SELECT * FROM wiki_history WHERE user_id = ? ORDER BY created_at DESC`,
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

User.getBadges = async () => {
  const [badges] = await pool.query(`SELECT * FROM badges;`);
  return badges;
};

User.setRepBadge = async (rep_badge_id, user_id) => {
  try {
    await pool.query(`UPDATE users SET rep_badge = ? WHERE id = ?`, [
      rep_badge_id,
      user_id,
    ]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

User.editInfo = async (name, stu_id, nickname, user_id) => {
  try {
    await pool.query(
      `UPDATE users SET name = ?, stu_id = ?, nickname = ? WHERE id = ?`,
      [name, stu_id, nickname, user_id]
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

User.initAttend = async (user_id) => {
  await pool.query(`INSERT INTO user_attend (user_id) VALUES (?)`, [user_id]);
  return true;
};

User.markAttend = async (user_id) => {
  const [attend_info] = await pool.query(
    `SELECT * FROM user_attend WHERE user_id = ?`,
    [user_id]
  );

  //오늘 첫 출석이라면
  if (!attend_info.today_attend) {
    //연속 출석일수가 최대 연속 출석일수보다 크다면 최대 연속 출석일수를 업데이트
    let max_attend = 0;
    if (attend_info.max_attend) {
      max_attend =
        attend_info.max_attend < attend_info.cont_attend + 1
          ? attend_info.cont_attend + 1
          : attend_info.max_attend;
    }

    await pool.query(
      `UPDATE user_attend SET today_attend = true, cont_attend = cont_attend + 1, total_attend = total_attend + 1, max_attend = ? WHERE user_id = ? `,
      [max_attend, user_id]
    );
    return true;
  }
  return false;
};

//user_id와 restrict_period(제한 하고 싶은 일수)를 받아서 제약을 설정
User.setConstraint = async (user_id, restrict_period) => {
  let date = new Date();
  let formattedDate;

  //restrict_period가 0이라면 제약을 해제한다.
  if (restrict_period == 0) {
    date.setDate(date.getDate() - 1);
  }
  //restrict_period가 0이 아니라면 제약을 설정한다.
  else {
    date.setDate(date.getDate() + restrict_period);
  }

  // MySQL DATE 형식에 맞게 날짜를 변환: YYYY-MM-DD
  formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  //정해진 날짜로 제약을 설정
  await pool.query(`UPDATE users SET restrict_period = ? WHERE id = ?`, [
    formattedDate,
    user_id,
  ]);
  return true;
};

User.deactivate = async (user_id) => {
  try {
    await pool.query(`UPDATE users SET is_deleted = 1 WHERE id = ?`, [user_id]);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

User.getConstraint = async () => {
  const [constraint] = await pool.query(
    `SELECT id, login_id, name, stu_id, email, nickname, point, restrict_period, restrict_count FROM users WHERE restrict_period >= CURDATE();`
  );
  return constraint;
};

User.debatetHistory = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT 
      debates.id AS debate_id,
      debates.subject AS debate_subject,
      debate_history.content AS debate_content,
      debate_history.created_at AS debate_content_time,
      debate_history.is_bad AS is_bad,
      wiki_docs.title AS doc_title
      FROM 
          debates
      JOIN 
          debate_history ON debates.id = debate_history.debate_id
      JOIN
          wiki_docs ON debates.doc_id = wiki_docs.id
      WHERE 
          debates.user_id = ? 
      ORDER BY
          debate_history.created_at DESC;`,
    [user_id]
  );
  return rows;
};

User.questionHistory = async (user_id, arrange) => {
  //최신순 조회
  let rows;
  if (arrange == 0) {
    [rows] = await pool.query(
      `SELECT q.*, w.id AS doc_id, w.title AS doc_title, COUNT(ql.user_id) AS like_count FROM questions q JOIN wiki_docs w ON q.doc_id = w.id LEFT JOIN question_like ql ON q.id = ql.id WHERE q.user_id = 1234 GROUP BY q.id ORDER BY q.created_at DESC;`,
      [user_id]
    );
  }
  //인기순 조회
  else if (arrange == 1) {
    [rows] = await pool.query(
      `SELECT q.*, w.id AS doc_id, w.title AS doc_title, COUNT(ql.user_id) AS like_count FROM questions q JOIN wiki_docs w ON q.doc_id = w.id LEFT JOIN question_like ql ON q.id = ql.id WHERE q.user_id = 1234 GROUP BY q.id ORDER BY like_count DESC, q.created_at DESC;;`,
      [user_id]
    );
  }

  return rows;
};

module.exports = User;
