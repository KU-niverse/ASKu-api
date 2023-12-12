const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/userModel");
const Koreapas = require("../models/koreapasModel");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "login_id",
        passwordField: "password",
        passReqToCallback: false,
      },
      async (login_id, password, done) => {
        try {
          const koreapas = new Koreapas({ login_id, password });
          const is_verified = await koreapas.verifyIdPw();

          //고파스 로그인 실패
          if (is_verified == false) {
            done(null, false, {
              message: "아이디와 비밀번호를 다시 확인해주세요.",
            });
          }
          //고파스 로그인 성공
          else if (is_verified == true) {
            const koreapas_nickname = koreapas.getNickname();
            const koreaps_uuid = koreapas.getUuid();
            //유저를 생성
            const user = User.createUserByUuid(koreaps_uuid);
            //유저 정보를 불러오기
            const user_exist = await user.loadUserByUuid();

            //유저가 없으면 정보만 전달
            if (user_exist == false) {
              done(null, false, {
                message: "고파스 아이디로 최초 로그인하셨습니다.",
                koreapas_nickname,
                koreaps_uuid,
              });
            }
            //유저가 있으면(고파스 아이디로 최초 로그인이 아님) 닉네임을 업데이트
            else if (user_exist == true) {
              await user.syncNickname({ nickname: koreapas_nickname });
              done(null, [user]);
            }
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
