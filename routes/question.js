const express = require("express");
const questionMid = require("../controllers/questionController");

const router = express.Router();

// GET /question/view/:title
router.get("/view/:title", questionMid.questionGetMid);

// POST question/new/:title
router.post("/new/:title", questionMid.questionPostMid);

// POST question/edit/:question
router.post("/edit/:question", questionMid.questionEditMid);

// DELETE question/delete/:question
router.delete("/delete/:question", questionMid.questionDeleteMid);

// POST question/like
router.post("/like/:question", questionMid.questionLikeMid);

// GET question/query/:query(*)
//router.get("/query/:query", questionMid);

// GET question/popular
//router.get("/popular", questionMid);

module.exports = router;