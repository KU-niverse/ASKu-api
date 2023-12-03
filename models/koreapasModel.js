const axios = require("axios");

class Koreapas {
  constructor({ login_id, password }) {
    this.login_id = login_id;
    this.password = password;
    this.uuid = null;
    this.nickname = null;
  }

  static createKoreapas({ login_id, password }) {
    try {
      return new Koreapas({ login_id, password });
    } catch (error) {
      console.error(`🚨 model -> ⚡️ Koreapas-createKoreapas : 🐞${error}`);
      throw error;
    }
  }
  getNickname() {
    try {
      if (this.nickname === null) {
        throw new Error("nickname이 없습니다, verifyIdPw를 먼저 실행해주세요.");
      }
      if (this.nickname !== null) {
        return this.nickname;
      }
    } catch (error) {
      console.error(`🚨 model -> ⚡️ Koreapas-getNickname : 🐞${error}`);
      throw error;
    }
  }
  getUuid() {
    try {
      if (this.uuid === null) {
        throw new Error("uuid가 없습니다, verifyIdPw를 먼저 실행해주세요.");
      }
      if (this.uuid !== null) {
        return this.uuid;
      }
    } catch (error) {
      console.error(`🚨 model -> ⚡️ Koreapas-getUuid : 🐞${error}`);
      throw error;
    }
  }
  //주어진 login_id와 password로 로그인 시도
  async verifyIdPw() {
    try {
      const res = await axios.post(
        `https://www.koreapas.com/bbs/login_api.php?user_id=${this.login_id}&password=${this.password} &api_key=${process.env.KOREAPAS_API_KEY}`,
        {}
      );

      if (res.status == 200) {
        if (res.data.result == true) {
          this.uuid = res.data.data.uuid;
          this.nickname = res.data.data.nickname;
          return true;
        }
        if (res.data.result == false) {
          return false;
        }
      }
      if (res.status !== 200) {
        throw new Error("고파스 로그인 api 서버 에러");
      }
    } catch (error) {
      console.error(`🚨 model -> ⚡️ Koreapas-verifyIdPw : 🐞${error}`);
      throw error;
    }
  }
}

module.exports = Koreapas;
