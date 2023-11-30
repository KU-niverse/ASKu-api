import express from 'express';
import * as questionMid from '../controllers/questionController';
import { newActionQuestion, cancelActionQuestion, newActionLike } from '../middlewares/user_action';
import { isSignedIn } from "../middlewares/sign_in";
import { recordSearch } from '../middlewares/search';
import { newNotice } from "../middlewares/notification";

const router = express.Router();

// GET /question/view/:flag/:title
router.get("/view/:flag/:title", questionMid.questionGetAllMid);

// GET question/lookup/:id
router.get("/lookup/:id", questionMid.questionGetMid);

// POST question/new/:title
router.post(
  "/new/:title",
  isSignedIn,
  questionMid.questionPostMid,
  newActionQuestion,
  newNotice
);

// POST question/edit/:question
router.post("/edit/:question", isSignedIn, questionMid.questionEditMid);

// DELETE question/delete/:question
router.delete(
  "/delete/:question",
  isSignedIn,
  questionMid.questionDeleteMid,
  cancelActionQuestion
);

// POST question/like
router.post(
  "/like/:question",
  isSignedIn,
  questionMid.questionLikeMid,
  newActionLike
);

// GET question/query/:query(*)
router.get("/query/:query(*)", recordSearch, questionMid.questionSearchGetMid);

// GET question/popular
router.get("/popular", questionMid.questionPopularGetMid);

// GET question/answer/:question
router.get("/answer/:question", questionMid.questionAnswerGetMid); // 답변 조회

export default router;
