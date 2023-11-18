import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// const LocalStrategy = require("passport-local").Strategy;
import * as bcrypt from "bcrypt";

import User from "../models/userModel";


module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "login_id",
        passwordField: "password",
        passReqToCallback: false,
      },
      async (login_id: string, password: string, done: any) => {
        try {
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
