// 검색 기록 저장을 위한 미들웨어입니다.

const {postSearch} = require("../models/searchModel");

exports.recordSearch = async (req, res, next) => {
  const keyword = req.params.query || req.params.title;
  const user = req.user[0].id ? req.user[0].id : 0; // FIXME: 비로그인 가상 유저 만들면 0 -> 해당 id로 수정 필요
  if (keyword) {
    try {
      await postSearch(user, keyword);
    } catch (err) {
      console.error(err);
      res.status(500).send({message: "오류가 발생하였습니다."});
    }
  }
  next();
};