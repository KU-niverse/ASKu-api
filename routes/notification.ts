import express from 'express';
const router = express.Router();

import notificationMid from "../controllers/notificationController";
import { isSignedIn } from '../middlewares/sign_in';
import { isAdmin } from '../middlewares/admin';

// GET notification/user
router.get("/user", isSignedIn, notificationMid.userNoticeGetMid);

// GET notification/admin
router.get("/admin", isSignedIn, isAdmin, notificationMid.adminNoticeGetMid);

// POST notification/read
router.post("/read", isSignedIn, isAdmin, notificationMid.NoticeReadPostMid);

export default router;
