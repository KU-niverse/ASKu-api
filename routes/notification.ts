const notificationMid = require("../controllers/notificationController");

// GET notification/user
router.get("/user", isSignedIn, notificationMid.userNoticeGetMid);

// GET notification/admin
router.get("/admin", isSignedIn, isAdmin, notificationMid.adminNoticeGetMid);

// POST notification/read
router.post("/read", isSignedIn, isAdmin, notificationMid.NoticeReadPostMid);

module.exports = router;