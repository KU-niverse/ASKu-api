const express = require("express");
const reportMid = require("../controllers/reportController");

const router = express.Router();

// POST /report/:type
router.post("/:type", reportMid.reportPostMid);

module.exports = router;