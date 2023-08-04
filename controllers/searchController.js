const {getKeywordRank} = require("../models/searchModel");

exports.popularRankGetMid = async (req, res) => {
  try {
    const ranks = await getKeywordRank();
    res.status(200).send({success: false, message: "인기순 검색어를 조회하였습니다.", data: ranks});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};