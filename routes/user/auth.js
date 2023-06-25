const express = require("express");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  signUp,
  signIn,
  signOut,
  idDupCheck,
} = require("../../controllers/userController/auth");

const router = express.Router();

router.post("/signup", isNotSignedIn, signUp);
/* 
router.post("/signin", isNotSignedIn, signIn);

router.get("/signout", isSignedIn, signOut); */

/**
 * @swagger
 * /user/auth/iddupcheck/{loginid}:
 *   get:
 *    summary: "로그인 아이디 중복검사"
 *    description: "회원가입시 로그인 아이디 중복검사"
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: loginid
 *        required: true
 *        description: 유저 로그인 아이디
 *        schema:
 *          type: string
 *    responses:
 *      "201":
 *        description: 성공시 결과값 (유저 수정)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 *                  example: "사용가능한 아이디입니다."

 */
router.get("/iddupcheck/:loginid", isNotSignedIn, idDupCheck);

router.get("/issignedin", isSignedIn, (req, res) => {
  console.log("로그인한 상태입니다.");
  return res
    .status(201)
    .json({ success: true, message: "로그인한 상태입니다." });
});

module.exports = router;
