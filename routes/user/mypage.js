const express = require("express");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  info,
  wikiHistory,
} = require("../../controllers/userController/myPage");

const router = express.Router();

router.get("/info", isSignedIn, info);
router.get("/wikihistory", isSignedIn, wikiHistory);
module.exports = router;
