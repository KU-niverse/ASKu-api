const reportMid = require("../controllers/reportController");
const { newActionReport } = require("../middlewares/user_action");

// PUT /report/check
router.put("/check", isSignedIn, isAdmin, reportMid.reportCheckPostMid, newActionReport);

// POST /report/:type
router.post("/:type", isSignedIn, reportMid.reportPostMid, newNotice);

module.exports = router;