const express = require("express");
const notificationMid = require("../controllers/notificationController");

const router = express.Router();

// GET notification/user
router.get("/user", notificationMid.userNoticeGetMid);

// GET notification/admin
router.get("/admin", notificationMid.adminNoticeGetMid);

// POST notification/read
router.post("/read", notificationMid.NoticeReadPostMid);

module.exports = router;