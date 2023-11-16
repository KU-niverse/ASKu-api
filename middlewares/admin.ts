//admin인지 확인
export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user[0].is_admin == true) {
    next();
  } else {
    res.status(403).send({ success: false, message: "관리자가 아닙니다." });
  }
};
