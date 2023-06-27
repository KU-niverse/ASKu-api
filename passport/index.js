const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/userModel");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user[0].login_id);
  });

  passport.deserializeUser((id, done) => {
    User.findByLoginId(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
  local();
};
