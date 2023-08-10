const express = require("express");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  info,
  wikiHistory,
  badgeHistory,
  setRepBadge,
  editInfo,
  debatetHistory,
  questionHistory,
  getBadges,
} = require("../../controllers/userController/myPage");

const router = express.Router();

router.get("/info", isSignedIn, info);
router.get("/wikihistory", isSignedIn, wikiHistory);
router.get("/badgehistory", isSignedIn, badgeHistory);
router.put("/setrepbadge", isSignedIn, setRepBadge);
router.put("/editinfo", isSignedIn, editInfo);

router.get("/debatehistory", isSignedIn, debatetHistory);

router.get("/questionhistory/:arrange", isSignedIn, questionHistory);
router.get("/badges", isSignedIn, getBadges);

module.exports = router;
