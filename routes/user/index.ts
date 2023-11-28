import express from "express";
import auth from "./auth";
import mypage from "./mypage";

const router = express.Router();

router.use("/auth", auth);
router.use("/mypage", mypage);

export default router;
