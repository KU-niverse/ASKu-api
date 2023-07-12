const express = require("express");
const reportMid = require("../controllers/reportController");
const { isSignedIn } = require('../middlewares/sign_in');

const router = express.Router();

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid);

module.exports = router;