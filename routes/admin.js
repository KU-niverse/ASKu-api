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

//제한중인 유저 목록
router.get("/constraint", isSignedIn, isAdmin, admin.getConstraint);


//문서별 조회수 순위
router.get("/docsviews", admin.getDocsViews);

//회원 별 닉네임, 기여도, 기여 순위
router.get("/userlist", admin.getUserList);

//북마크 랭킹 추출하기
router.get("/bookmarkrank", admin.getBookmarkRanking);
//router.get("/bookmarkrank", isSignedIn, isAdmin, admin.getBookmarkRanking);


module.exports = router;
