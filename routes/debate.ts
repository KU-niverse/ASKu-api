import express from 'express';
const router = express.Router();
import * as debateMid from "../controllers/debateController";
import { isSignedIn } from "../middlewares/sign_in";
import { newActionDebate } from "../middlewares/user_action";

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

// GET /debate/search/:title/:query
router.get("/search/:title/:query", debateMid.debateSearchGetMid);

// GET /debate/searchall/:query
router.get("/searchall/:query", debateMid.debateSearchAllGetMid);

// POST /debate/end/:title/:debate
router.post("/end/:title/:debate", isSignedIn, debateMid.debateEndPostMid);

export default router;
