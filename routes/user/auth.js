/* const express = require("express");
const passport = require("passport");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  signUp,
  signIn,
  signOut,
} = require("../../controllers/userController/auth");

const router = express.Router();

router.post("/signup", isNotSignedIn, signUp);

router.post("/signin", isNotSignedIn, signIn);

router.get("/signout", isSignedIn, signOut);


router.get("/issignedin", isSignedIn, (req, res) => {
  console.log("로그인한 상태입니다.");
  return res
    .status(201)
    .json({ success: true, message: "로그인한 상태입니다." });
});
module.exports = router;
 */
