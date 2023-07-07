const express = require("express");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  info,
  wikiHistory,
  badgeHistory,
  setRepBadge,
} = require("../../controllers/userController/myPage");

const router = express.Router();

router.get("/info", isSignedIn, info);
router.get("/wikihistory", isSignedIn, wikiHistory);
router.get("/badgehistory", isSignedIn, badgeHistory);
router.put("/setrepbadge", isSignedIn, setRepBadge);

module.exports = router;
