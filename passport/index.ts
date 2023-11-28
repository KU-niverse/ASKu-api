import * as passport from "passport";
const local = require("./localStrategy");
import User from "../models/userModel";
//TODO: user수정
export const passportConfig = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user[0].login_id);
  });

  passport.deserializeUser((id, done) => {
    User.findByLoginId(id)
      .then((user: any) => done(null, user))
      .catch((err: any) => done(err));
  });
  local();
};
