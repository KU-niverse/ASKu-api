const express = require("express");
const reportMid = require("../controllers/reportController");
const { isSignedIn } = require('../middlewares/sign_in');
const { isAdmin } = require("../middlewares/admin");
const { newNotice } = require("../middlewares/notification");

const router = express.Router();

// PUT /report/check
router.put("/check", isSignedIn, isAdmin, reportMid.reportCheckPostMid, ); // 배지 회수 미들웨어 붙이기

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid, newNotice);

module.exports = router;