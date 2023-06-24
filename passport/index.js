const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/userModel");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.find_user(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });
  local();
};
