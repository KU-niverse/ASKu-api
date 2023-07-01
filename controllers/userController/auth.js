/* const express = require("express"); */
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
var appDir = path.dirname(require.main.filename);

/* const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const { signUp, signIn, signOut } = require("../../controllers/user/auth"); */

exports.idDupCheck = async (req, res, next) => {
  const login_id = req.params.loginid;
  try {
    const ex_user_login_id = await User.findByLoginId(login_id);
    if (ex_user_login_id.length != 0) {
      return res.status(400).json({
        success: false,
        message: "이미 존재하는 아이디입니다.",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "사용 가능한 아이디입니다.",
      });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.nickDupCheck = async (req, res, next) => {
  const nickname = req.params.nick;
  try {
    const ex_user_nickname = await User.findByNickname(nickname);
    if (ex_user_nickname.length != 0) {
      return res.status(400).json({
        success: false,
        message: "이미 존재하는 닉네임입니다.",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "사용 가능한 닉네임입니다.",
      });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.emailDupCheck = async (req, res, next) => {
  const email = req.params.email;

  // '@korea.ac.kr' 형식인지 확인하기 위한 정규식
  const regex = /[@]korea[.]ac[.]kr$/;

  try {
    // '@korea.ac.kr' 형식이 아닌 경우 에러 메시지 전송
    if (!regex.test(email) || email == "@korea.ac.kr") {
      return res.status(400).json({
        success: false,
        message: "이메일은 '{email_id}@korea.ac.kr' 형식이어야 합니다.",
      });
    }

    const ex_user_email = await User.findByEmail(email);
    if (ex_user_email.length != 0) {
      return res.status(400).json({
        success: false,
        message: "이미 존재하는 이메일입니다.",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "사용 가능한 이메일입니다.",
      });
    }
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

//회원가입 후 인증 이메일 전송
exports.signUp = async (req, res) => {
  const { login_id, name, stu_id, email, password, nickname } = req.body;
  try {
    //아이디, 이메일, nickname 중복검사, 비밀번호 확인은 프론트에서 처리, 학번은 중복검사x
    const hash = await bcrypt.hash(password, 12);
    const uuid = uuidv4();
    const auth_uuid = uuidv4();
    const result = await User.tempCreate({
      login_id,
      name,
      stu_id,
      email,
      password: hash,
      nickname,
      uuid,
      auth_uuid,
    });
    if (!result) {
      return res.status(400).json({
        success: false,
        maessage: "회원가입에 실패하였습니다. 중복된 항목이 있습니다.",
      });
    }

    //메일 전송
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      to: "sup1214@korea.ac.kr",
      subject: "ASKu 회원가입",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>이메일 인증</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #F7F7F7;
              }
              .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #FFFFFF;
                  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
              }
              .logo {
                  text-align: center;
              }
              .message {
                  text-align: center;
                  margin-bottom: 40px;
              }
              .button {
                  display: block;
                  width: 200px;
                  height: 50px;
                  margin: 0 auto;
                  background: #4E9CAF;
                  padding: 10px;
                  text-align: center;
                  border-radius: 5px;
                  color: white;
                  font-weight: bold;
                  line-height: 25px;
                  cursor: pointer;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="logo">
                  <img src="data:image/png;base64,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" alt="Logo" />
              </div>
              <div class="message">
                  <p>가입해주셔서 감사합니다! 이메일 인증을 완료하려면 아래 버튼을 클릭해주세요.</p>
              </div>
              <div class="button-container">
                  <a href="https://www.asku.wiki/signup/complete/${auth_uuid}" class="button">가입확인</a>
              </div>
          </div>
      </body>
      </html>`,
    };
    await transporter.sendMail(mailOptions);

    //회원가입로직 return
    return res.status(201).json({
      success: true,
      message:
        "임시 회원가입을 하였습니다. 04:00까지 이메일인증을 완료해주세요.",
      login_id: login_id,
      nickname,
      name,
      stu_id,
      email,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      maessage: "회원가입에 실패하였습니다. 중복된 항목이 있는 것 같습니다.",
    });
  }
};

//로그인
exports.signIn = async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log("로그인 성공");
      return res
        .status(201)
        .json({ success: true, message: "로그인에 성공하였습니다!" });
    });
  })(req, res, next);
};

//로그아웃
exports.signOut = (req, res) => {
  try {
    req.logout(() => {
      console.log("로그아웃 되었습니다.");
      res.status(200).send({ success: true, message: "로그아웃 되었습니다." });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "로그아웃에 실패하였습니다.",
    });
  }
};

exports.changePw = async (req, res) => {
  try {
    const { login_id, password } = req.body;
    const new_pw = password;
    const current_pw = req.user[0].password;
    //기존 비밀번호와 비교
    const is_not_changeed = await bcrypt.compare(new_pw, current_pw);
    if (is_not_changeed) {
      return res.status(400).json({
        success: false,
        message: "기존 비밀번호와 동일합니다.",
      });
    } else {
      const hashed_pw = await bcrypt.hash(new_pw, 12);
      const result = User.changePw(login_id, hashed_pw);
      if (result) {
        return res.status(400).json({
          success: true,
          message: "비밀번호 변경이 완료되었습니다.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "changePw(controller)에서 문제가 발생했습니다.",
    });
  }
};

exports.findId = async (req, res) => {
  try {
    const email = req.body.email;
    const found_user = await User.findByEmail(email);
    if (found_user.length == 0) {
      return res.status(400).json({
        success: false,
        message: "이메일과 일치하는 유저가 없습니다.",
      });
    }
    const login_id = found_user[0].login_id;
    return res.status(200).json({
      success: true,
      message: "아이디를 성공적으로 찾았습니다.",
      login_id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "findId(controller)에서 문제가 발생했습니다.",
    });
  }
};

exports.signUpEmailCheck = async (req, res) => {
  try {
    const auth_uuid = req.body.auth_uuid;
    const result = await User.register_auth(auth_uuid);
    if (result) {
      console.log("회원가입을 성공적으로 완료하였습니다.");
      return res.status(200).json({
        success: true,
        message: "회원가입을 성공적으로 완료하였습니다.",
      });
    } else {
      console.log("회원가입 세션이 만료되었습니다.");
      return res.status(400).json({
        success: false,
        message:
          "회원가입 세션이 만료되었습니다. 처음부터 다시 회원가입을 진행해주세요.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "signUpEmailCheck-controller에서 문제가 발생했습니다.",
    });
  }
};
