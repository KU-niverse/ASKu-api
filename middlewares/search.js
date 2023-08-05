// 검색 기록 저장을 위한 미들웨어입니다.

const {postSearch} = require("../models/searchModel");

exports.recordSearch = async (req, res, next) => {
  const keyword = req.params.query || req.params.title;
  const user = (req.user && req.user[0] && req.user[0].id) ? req.user[0].id : 0;
  if (keyword) {
    try {
      await postSearch(user, keyword);
    } catch (err) {
      console.error(err);
      res.status(500).send({success: false, message: "오류가 발생하였습니다."});
    }
  }
  next();
};