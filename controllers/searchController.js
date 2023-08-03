const {getKeywordRank} = require("../models/searchModel");

exports.popularRankGetMid = async (req, res) => {
  try {
    const ranks = await getKeywordRank();
    res.status(200).send(ranks);
  } catch (err) {
    console.error(err);
    res.status(500).send({message: "오류가 발생하였습니다."});
  }
};