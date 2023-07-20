const express = require("express");
const reportMid = require("../controllers/reportController");
const { isSignedIn } = require('../middlewares/sign_in');
const { newNotice } = require("../middlewares/notification");

const router = express.Router();

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid, newNotice);

module.exports = router;