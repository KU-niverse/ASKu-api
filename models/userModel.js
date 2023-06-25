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
User.find_by_login_id = async (login_id) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE login_id = ?`, [
    login_id,
  ]);
  return rows;
};

User.find_by_id = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows;
};

User.create = async (newUser) => {
  const [rows] = await pool.query(`INSERT INTO users SET ?`, [newUser]);
  return rows;
};

module.exports = User;
