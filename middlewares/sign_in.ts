import User from "../models/userModel";

export const isSignedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //TODO: 유저 출석 체크 로직이 이쪽에 들어가는 것이 맞는지에 대한 근본적인 고민
    User.markAttend(req.user[0].id);
    next();
  } else {
    res.status(401).send({ success: false, message: "로그인이 필요합니다." });
  }
};

export const isNotSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    return res
      .status(400)
      .json({ success: false, message: "로그인된 상태입니다." });
  }
};
