import { Request as ExpressRequest, Response, NextFunction } from "express";
import { postSearch } from "../models/searchModel";

type ExtendedUser = Express.User & {
  id?: number;
};

interface CustomRequest extends ExpressRequest {
  user?: ExtendedUser;
}

export const recordSearch = async (req: CustomRequest, res: Response, next: NextFunction) => {
  let keyword = "";
  if (req.params.query) {
    keyword = req.params.query.trim();
  } else if (req.params.title) {
    keyword = req.params.title.trim();
  } else {
    keyword = "";
  }

  const userId = req.user && req.user.id ? req.user.id : 0;
  if (keyword) {
    try {
      await postSearch(userId, keyword);
    } catch (err) {
      console.error(err);
      res.status(500).send({success: false, message: "오류가 발생하였습니다."});
    }
  }
  next();
};
