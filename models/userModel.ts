import pool from "../config/db";

class User {
  id: number;
  login_id: string;
  name: string;
  stu_id: string;
  email: string;
  password: string;
  nickname: string;
  rep_badge: number;
  created_at: any;
  point: number;
  is_admin: boolean;
  restrict_period: any;
  restrict_count: boolean;
  uuid: string;
  is_deleted: boolean;
  static findByLoginIdTemp: any;
  static findByNicknameTemp: any;
  static findByEmailTemp: any;
  static findById: any;
  static findByLoginId: any;
  static findByNickname: any;
  static findByEmail: any;
  static create: any;
  static tempCreate: (newUser: any) => Promise<boolean>;
  static changePw: (user_id: any, hashed_new_pw: any) => Promise<boolean>;
  static getUserInfo: any;
  static register_auth: (auth_uuid: any) => Promise<any>;
  static createChangePwSession: (login_id: any, hashed_login_id: any) => Promise<boolean>;
  static checkPwChangeSession: any;
  static deletePwFindSession: (hashed_login_id: any) => Promise<boolean>;
  static getWikiHistory: any;
  static getBadgeHistory: any;
  static getBadges: any;
  static setRepBadge: (rep_badge_id: any, user_id: any) => Promise<boolean>;
  static editNick: (nickname: any, user_id: any) => Promise<boolean>;
  static init: (user_id: any) => Promise<boolean>;
  static markAttend: (user_id: any) => Promise<boolean>;
  static setConstraint: (user_id: any, restrict_period: any) => Promise<boolean>;
  static deactivate: (user_id: any) => Promise<boolean>;
  static getConstraint: any;
  static debatetHistory: any;
  static questionHistory: (user_id: any, arrange: any) => Promise<any>;
  constructor(user: { id: any; login_id: any; name: any; stu_id: any; email: any; password: any; nickname: any; rep_badge: any; created_at: any; point: any; is_admin: any; restrict_period: any; restrict_count: any; uuid: any; is_deleted: any; }) {
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
User.findByLoginIdTemp = async (login_id: string) => {
  const [rows] = await pool.query(
    `SELECT * FROM temp_users WHERE login_id = ?`,
    [login_id]
  );
  return rows;
};

//temp에서 nickname으로 유저 찾기
User.findByNicknameTemp = async (nickname: string) => {
  const [rows] = await pool.query(
    `SELECT * FROM temp_users WHERE nickname = ?`,
    [nickname]
  );
  return rows;
};
//temp에서 email로 유저 찾기
User.findByEmailTemp = async (email: string) => {
  const [rows] = await pool.query(`SELECT * FROM temp_users WHERE email = ?`, [
    email,
  ]);

  return rows;
};

//user_id로 유저 찾기
User.findById = async (id: number) => {
  const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return user;
};

//login_id로 유저 찾기
User.findByLoginId = async (login_id: string) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE login_id = ?`, [
    login_id,
  ]);
  return rows;
};

//nickname으로 유저 찾기
User.findByNickname = async (nickname: string) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE nickname = ?`, [
    nickname,
  ]);
  return rows;
};
//email로 유저 찾기
User.findByEmail = async (email: string) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);

  return rows;
};

//#TODO:변수 전달 방식에서 개선의 여지가 있음
User.create = async (newUser: { login_id: string; name: string; stu_id: string; email: string; password: string; nickname: string; uuid: string; }) => {
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
  if (Array.isArray(dup_user) && dup_user.length > 0) {
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
User.changePw = async (user_id: number, hashed_new_pw: string) => {
  await pool.query(`UPDATE users SET password = ? WHERE id = ?;`, [
    hashed_new_pw,
    user_id,
  ]);
  return true;
};

//회원정보 변경
User.getUserInfo = async (user_id: number) => {
  const [user] = await pool.query(
    `SELECT users.id, users.name, users.login_id, users.stu_id, users.email, users.rep_badge as rep_badge_id, users.nickname, users.created_at, users.point, users.is_admin, users.restrict_period, users.restrict_count, badges.name as rep_badge_name, badges.image as rep_badge_image FROM users left join badges on users.rep_badge = badges.id WHERE users.id = ?`,
    [user_id]
  );
  return user;
};

//회원가입 이메일 인증
User.register_auth = async (auth_uuid) => {
  //temporary_user에 현재 해당 auth_uuid 존재하는지 확인
  const [temp_user] = await pool.query(
    `SELECT * FROM temp_users WHERE auth_uuid = ?;`,
    [auth_uuid]
  );
  if (Array.isArray(temp_user) && temp_user.length === 1) {
    const [user] = await User.create(temp_user[0]);
    await pool.query(`DELETE FROM temp_users WHERE auth_uuid = ?;`, [
      auth_uuid,
    ]);
    return user.id;
  } else {
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

User.checkPwChangeSession = async (hashed_login_id: any) => {
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

User.getWikiHistory = async (user_id: number) => {
  const [user_wiki_history] = await pool.query(
    `SELECT wiki_history.*, wiki_docs.title FROM wiki_history inner join wiki_docs on wiki_history.doc_id = wiki_docs.id WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
  return user_wiki_history;
};

User.getBadgeHistory = async (user_id: number) => {
  const [user_badge_history] = await pool.query(
    `SELECT badge_history.*, badges.image, badges.name, badges.description FROM badge_history inner join badges on badge_history.badge_id = badges.id WHERE user_id = ? order by badge_history.created_at DESC`,
    [user_id]
  );
  return user_badge_history;
};

User.getBadges = async () => {
  const [badges] = await pool.query(`SELECT 
  badges.*,
  COUNT(badge_history.id) AS history_count
FROM
  badges
LEFT JOIN 
  badge_history ON badges.id = badge_history.badge_id
GROUP BY 
  badges.id, badges.name, badges.image, badges.description, badges.event, badges.cont
ORDER BY 
  history_count ASC, badges.id ASC;`);
  return badges;
};

User.setRepBadge = async (rep_badge_id: number, user_id: number) => {
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

User.editNick = async (nickname: string, user_id: number) => {
  try {
    await pool.query(`UPDATE users SET nickname = ? WHERE id = ?`, [
      nickname,
      user_id,
    ]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

User.init = async (user_id: number) => {
  await pool.query(
    `
    INSERT INTO user_attend (user_id) VALUES (?);
    INSERT INTO ai_session (user_id) VALUES (?);`,
    [user_id, user_id, user_id, user_id]
  );
  return true;
};

User.markAttend = async (user_id: number) => {
  const [attend_info] = await pool.query(
    `SELECT * FROM user_attend WHERE user_id = ?`,
    [user_id]
  );
  //오늘 첫 출석이라면

  if (!attend_info[0].today_attend) {
    //연속 출석일수가 최대 연속 출석일수보다 크다면 최대 연속 출석일수를 업데이트
    let max_attend = attend_info[0].max_attend;
    if (attend_info[0].max_attend < attend_info[0].cont_attend + 1) {
      max_attend = attend_info[0].cont_attend + 1;
    }
    await pool.query(
      `UPDATE user_attend 
      SET 
        cont_attend = CASE WHEN today_attend = false THEN cont_attend + 1 ELSE cont_attend END, 
        total_attend = CASE WHEN today_attend = false THEN total_attend + 1 ELSE total_attend END, 
        max_attend = CASE WHEN today_attend = false THEN ? ELSE max_attend END,
        today_attend = true
      WHERE user_id = ? and today_attend = false;`,
      [max_attend, user_id]
    );
    return true;
  }
  return false;
};

//user_id와 restrict_period(제한 하고 싶은 일수)를 받아서 제약을 설정
User.setConstraint = async (user_id: number, restrict_period: number) => {
  let date = new Date();
  let formattedDate: string;

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

User.deactivate = async (user_id: number) => {
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

User.debatetHistory = async (user_id: number) => {
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
          debate_history.user_id = ? 
      ORDER BY
          debate_history.created_at DESC;`,
    [user_id]
  );
  return rows;
};

User.questionHistory = async (user_id: number, arrange: number) => {
  //최신순 조회
  let rows: any;
  if (arrange == 0) {
    [rows] = await pool.query(
      `SELECT q.*, users.nickname, users.rep_badge, badges.image as badge_image, wiki_docs.title as doc_title,  COALESCE(ql.like_count, 0) AS like_count, COALESCE(a.answer_count, 0) AS answer_count
      FROM questions q
      INNER JOIN users ON q.user_id = users.id
      INNER JOIN badges ON users.rep_badge = badges.id
      INNER JOIN wiki_docs ON q.doc_id = wiki_docs.id
      LEFT JOIN (
          SELECT id, COUNT(*) as like_count 
          FROM question_like 
          GROUP BY id
      ) ql ON q.id = ql.id
      LEFT JOIN (
          SELECT question_id, COUNT(*) as answer_count 
          FROM answers 
          GROUP BY question_id
      ) a ON q.id = a.question_id
      WHERE users.id = ?
      ORDER BY q.created_at DESC`,
      [user_id]
    );
  }
  //인기순 조회
  else if (arrange == 1) {
    [rows] = await pool.query(
      `SELECT q.*, users.nickname, users.rep_badge, badges.image as badge_image, wiki_docs.title as doc_title,  COALESCE(ql.like_count, 0) AS like_count, COALESCE(a.answer_count, 0) AS answer_count
      FROM questions q
      INNER JOIN users ON q.user_id = users.id
      INNER JOIN badges ON users.rep_badge = badges.id
      INNER JOIN wiki_docs ON q.doc_id = wiki_docs.id
      LEFT JOIN (
          SELECT id, COUNT(*) as like_count 
          FROM question_like 
          GROUP BY id
      ) ql ON q.id = ql.id
      LEFT JOIN (
          SELECT question_id, COUNT(*) as answer_count 
          FROM answers 
          GROUP BY question_id
      ) a ON q.id = a.question_id
      WHERE users.id = ?
      ORDER BY like_count DESC, q.created_at DESC`,
      [user_id]
    );
  }

  return rows;
};

export default User;
