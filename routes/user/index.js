const express = require("express");

const auth = require("./auth");
const mypage = require("./mypage");
const router = express.Router();

router.use("/auth", auth);
router.use("/mypage", mypage);

module.exports = router;
