const express = require("express");
const admin = require("../controllers/adminController");
const { isSignedIn } = require("../middlewares/sign_in");
const { isAdmin } = require("../middlewares/admin");
const router = express.Router();

//admin 위키 히스토리 조회
router.get("/wikihistory", isSignedIn, isAdmin, admin.wikiHistory);

//admin 최근 생성된 문서 조회
router.get("/newdoc", isSignedIn, isAdmin, admin.newDoc);

//admin 모든 신고 조회
router.get("/report", isSignedIn, isAdmin, admin.report);

//admin 악성 유저 제한
router.post("/setconstraint", isSignedIn, isAdmin, admin.setConstraint);
module.exports = router;
