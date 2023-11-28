import express from 'express';
import * as reportMid from "../controllers/reportController";
import { newActionReport } from "../middlewares/user_action";
import { isSignedIn } from '../middlewares/sign_in';
import { isAdmin } from '../middlewares/admin';

const router = express.Router();

// PUT /report/check
router.put("/check", isSignedIn, isAdmin, reportMid.reportCheckPostMid, newActionReport);

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid, newNotice);

export default router;
