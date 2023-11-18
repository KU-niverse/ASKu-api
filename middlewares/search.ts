// 검색 기록 저장을 위한 미들웨어입니다.

import { postSearch } from "../models/searchModel";

export const recordSearch = async (req: { params: { query: string; title: string; }; user: { id: any; }[]; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; }): void; new(): any; }; }; }, next: () => void) => {
  let keyword = "";
  if (req.params.query) {
    keyword = req.params.query.trim();
  } else if (req.params.title) {
    keyword = req.params.title.trim();
  } else {
    keyword = "";
  }
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