const express = require("express");
const debateMid = require("../controllers/debateController");

const router = express.Router();

// POST /debate/new/:title
router.post("/new/:title", debateMid.debatePostMid);

// POST /debate/:title/new/:debate
router.post("/:title/new/:debate", debateMid.historyPostMid);

// GET /debate/list/:title
router.get("/list/:title", debateMid.debateGetMid);

// GET /debate/view/:title/:debate
router.get("/view/:title/:debate", debateMid.historyGetMid);

// POST /debate/end/:title/:debate
router.post("/end/:title/:debate", debateMid.debateEndPostMid);

module.exports = router;