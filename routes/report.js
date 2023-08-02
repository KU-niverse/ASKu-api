const express = require("express");
const reportMid = require("../controllers/reportController");
const { isSignedIn } = require('../middlewares/sign_in');
const { isAdmin } = require("../middlewares/admin");
const { newNotice } = require("../middlewares/notification");
const { newActionReport } = require("../middlewares/user_action");

const router = express.Router();

// PUT /report/check
router.put("/check", isSignedIn, isAdmin, reportMid.reportCheckPostMid, newActionReport);

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid, newNotice);

module.exports = router;