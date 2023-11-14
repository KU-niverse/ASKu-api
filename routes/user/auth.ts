import * as express from "express";

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const {
  signUp,
  signIn,
  signOut,
  idDupCheck,
  nickDupCheck,
  emailDupCheck,
  changePw,
  findId,
  signUpEmailCheck,
  findPw,
  deactivate,
  resetPw,
} = require("../../controllers/userController/auth");

const router = express.Router();

//회원가입 이메일 인증
router.post("/signup/emailcheck", signUpEmailCheck);
//회원가입
router.post("/signup", isNotSignedIn, signUp);
//로그인
router.post("/signin", isNotSignedIn, signIn);
//로그아웃
router.get("/signout", isSignedIn, signOut);

router.put("/deactivate", isSignedIn, deactivate);

//중복체크
//아이디 중복체크
router.get("/iddupcheck/:loginid", isNotSignedIn, idDupCheck);
//닉네임 중복체크
router.get("/nickdupcheck/:nick", nickDupCheck);
//이메일 중복체크
router.get("/emaildupcheck/:email", isNotSignedIn, emailDupCheck);

//상태확인

//로그인여부 확인
//TODO: 서버 에러 처리
router.get("/issignedin", isSignedIn, (req, res) => {
  return res
    .status(201)
    .json({ success: true, message: "로그인한 상태입니다." });
});

//아이디 찾기
router.post("/findid", isNotSignedIn, findId);
//비밀번호 찾기
router.post("/findpw", isNotSignedIn, findPw);
//비밀번호 변경
router.put("/changepw", isSignedIn, changePw);
//비밀번호 재설정
router.put("/resetpw", isNotSignedIn, resetPw);

module.exports = router;
