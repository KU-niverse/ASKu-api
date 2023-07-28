const express = require("express");
const admin = require("../controllers/adminController");
const { isSignedIn } = require("../middlewares/sign_in");
const { isAdmin } = require("../middlewares/admin");
const router = express.Router();

//admin 위키 히스토리 조회
router.get("/wikihistory", isSignedIn, isAdmin, admin.wikiHistory);

//admin 최근 생성된 문서 조회
router.get("/newdoc", admin.newDoc);

//admin 모든 신고 조회
router.get("/report", admin.report);

//admin 특정 타입의 신고 조회
//router.get("/report/:type", debateMid.historyGetMid);

module.exports = router;
