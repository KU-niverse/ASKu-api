const {getKeywordRank} = require("../models/searchModel");

exports.popularRankGetMid = async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; data?: any; }): void; new(): any; }; }; }) => {
  try {
    const ranks = await getKeywordRank();
    res.status(200).send({success: true, message: "인기순 검색어를 조회하였습니다.", data: ranks});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};