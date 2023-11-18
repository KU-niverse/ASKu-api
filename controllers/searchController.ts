import { Request, Response } from 'express';
import { getKeywordRank } from "../models/searchModel";

export const popularRankGetMid = async (req: Request, res: Response) => {
  try {
    const ranks = await getKeywordRank();
    res.status(200).send({success: true, message: "인기순 검색어를 조회하였습니다.", data: ranks});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: "오류가 발생하였습니다."});
  }
};
