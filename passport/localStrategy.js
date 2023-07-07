const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

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
          await console.log("실행됨");
          const exUser = await User.findByLoginId(login_id);
          if (exUser.length != 0) {
            const result = await bcrypt.compare(password, exUser[0].password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
