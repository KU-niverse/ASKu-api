import * as passport from "passport";
const local = require("./localStrategy");
import User from "../models/userModel";
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user[0].login_id);
  });

  passport.deserializeUser((id, done) => {
    User.findByLoginId(id)
      .then((user: any) => done(null, user))
      .catch((err: any) => done(err));
  });
  local();
};
