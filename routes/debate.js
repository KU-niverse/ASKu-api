const express = require("express");
const debateMid = require("../controllers/debateController");
const { isSignedIn } = require('../middlewares/sign_in');
const { newActionDebate } = require("../middlewares/user_action");

const router = express.Router();

// POST /debate/new/:title
router.post("/new/:title", isSignedIn, debateMid.debatePostMid);

// POST /debate/:title/new/:debate
router.post("/:title/new/:debate", isSignedIn, debateMid.historyPostMid, newActionDebate);

// GET /debate/list/:title
router.get("/list/:title", debateMid.debateGetMid);

// GET /debate/all/recent
router.get("/all/recent", debateMid.debateGetAllMid);

// GET /debate/view/:title/:debate
router.get("/view/:title/:debate", debateMid.historyGetMid);

// POST /debate/end/:title/:debate
router.post("/end/:title/:debate", isSignedIn, debateMid.debateEndPostMid);

module.exports = router;