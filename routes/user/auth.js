const express = require("express");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  signUp,
  signIn,
  signOut,
  idDupCheck,
  nickDupCheck,
} = require("../../controllers/userController/auth");

const router = express.Router();

/**
 * @swagger
 * /user/auth/signup:
 *   post:
 *    summary: "회원가입"
 *    description: "회원가입"
 *    tags: [User]
 *    requestBody:
 *      description: 회원가입 정보
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: "유저 이름"
 *              login_id:
 *                type: string
 *                description: "유저 로그인 아이디"
 *              stu_id:
 *                type: string
 *                description: "유저 학번"
 *              email:
 *                type: string
 *                description: "유저 이메일"
 *              password:
 *                type: string
 *                description: "유저 비밀번호"
 *              nickname:
 *                type: string
 *                escription: "유저 닉네임"
 *
 *
 *    responses:
 *      "201":
 *        description: 성공시 결과값 (회원가입)
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

//TODO:닉네임 중복검사, api명세 추가
router.get("/nickdupcheck/:nick", isNotSignedIn, nickDupCheck);

//TODO:이메일 중복검사, api명세 추가
/* router.get("/emaildupcheck/:email", isNotSignedIn, emailIdDupCheck); */

router.get("/issignedin", isSignedIn, (req, res) => {
  console.log("로그인한 상태입니다.");
  return res
    .status(201)
    .json({ success: true, message: "로그인한 상태입니다." });
});

module.exports = router;
