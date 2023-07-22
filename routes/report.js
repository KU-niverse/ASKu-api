const express = require("express");
const reportMid = require("../controllers/reportController");
const { isSignedIn } = require('../middlewares/sign_in');
const { isAdmin } = require("../middlewares/admin");
const { newNotice } = require("../middlewares/notification");

const router = express.Router();

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid, newNotice);

// POST /report/check
router.post("/check", isSignedIn, isAdmin, reportMid.reportCheckPostMid, ); // 배지 회수 미들웨어 붙이기

module.exports = router;