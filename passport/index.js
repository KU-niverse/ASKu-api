const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models/userModel");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user[0].uuid);
  });

  passport.deserializeUser((uuid, done) => {
    User.findByUuid(uuid)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
  local();
};
