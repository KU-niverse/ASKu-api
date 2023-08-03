const express = require("express");
const questionMid = require("../controllers/questionController");
const { isSignedIn } = require('../middlewares/sign_in');
const { newNotice } = require("../middlewares/notification");
const { newActionQuestion, cancelActionQuestion, newActionLike } = require("../middlewares/user_action");
const { recordSearch } = require("../middlewares/search.js");

const router = express.Router();

// GET /question/view/:title
router.get("/view/:title", questionMid.questionGetMid);

// POST question/new/:title
router.post("/new/:title", isSignedIn, questionMid.questionPostMid, newActionQuestion, newNotice);

// POST question/edit/:question
router.post("/edit/:question", isSignedIn, questionMid.questionEditMid);

// DELETE question/delete/:question
router.delete("/delete/:question", isSignedIn, questionMid.questionDeleteMid, cancelActionQuestion);

// POST question/like
router.post("/like/:question", isSignedIn, questionMid.questionLikeMid, newActionLike);

// GET question/query/:query(*)
router.get("/query/:query(*)", recordSearch, questionMid.questionSearchGetMid);

// GET question/popular
router.get("/popular", questionMid.questionPopularGetMid);

module.exports = router;