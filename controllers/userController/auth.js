/* const express = require("express"); */
const bycrypt = require("bcrypt");
const User = require("../../models/userModel");
const { v4: uuidv4 } = require("uuid");
/* const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const { signUp, signIn, signOut } = require("../../controllers/user/auth"); */

exports.idDupCheck = async (req, res, next) => {
  const login_id = req.params.loginid;
  try {
    const ex_user_login_id = await User.find_by_login_id(login_id);
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

//회원가입
exports.signUp = async (req, res) => {
  const { login_id, name, stu_id, email, password, nickname } = req.body;
  try {
    //아이디, 이메일, nickname 중복검사, 비밀번호 확인은 프론트에서 처리, 학번은 중복검사x
    const hash = await bycrypt.hash(password, 12);
    const uuid = uuidv4();
    await User.create({
      login_id,
      name,
      stu_id,
      email,
      password: hash,
      nickname,
      uuid,
    });
    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
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
      maessage: "회원가입에 실패하였습니다.",
    });
  }
};
