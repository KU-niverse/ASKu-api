const express = require("express");
const questionMid = require("../controllers/questionController");

const router = express.Router();

// GET /question/:title
router.get("/:title", questionMid.questionGetMid);

// POST question/:title
router.post("/:title", questionMid.questionPostMid);

// POST question/:question
//router.post("/:question", questionMid.);

// DELETE question/:question
//router.delete("/:question", questionMid.);

// POST question/add/like
router.post("/add/like", questionMid.questionLikeMid);

// GET question/query/:query(*)
//router.get("/query/:query", questionMid.);

module.exports = router;