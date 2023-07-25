const express = require("express");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  info,
  wikiHistory,
  badgeHistory,
  setRepBadge,
  editInfo,
  commentHistory,
  questionHistory,
} = require("../../controllers/userController/myPage");

const router = express.Router();

router.get("/info", isSignedIn, info);
router.get("/wikihistory", isSignedIn, wikiHistory);
router.get("/badgehistory", isSignedIn, badgeHistory);
router.put("/setrepbadge", isSignedIn, setRepBadge);
router.put("/editinfo", isSignedIn, editInfo);

router.get("/commenthistory", isSignedIn, commentHistory);
router.get("/questionhistory", isSignedIn, questionHistory);
module.exports = router;
