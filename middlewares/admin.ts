import { Request, Response, NextFunction } from "express";

//admin인지 확인
export const isAdmin = (req:Request, res: Response, next: NextFunction) => {
  if (req.user[0].is_admin == true) {
    next();
  } else {
    res.status(403).send({ success: false, message: "관리자가 아닙니다." });
  }
};
