/* const express = require("express"); */
const bycrypt = require("bcrypt");
const User = require("../../models/userModel");

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

//회원가입
exports.signUp = async (req, res, next) => {
  const { login_id, name, stu_id, email, phone, password, nickname } = req.body;
  try {
    const hash = await bycrypt.hash(password, 12);

    await User.create({
      login_id,
      name,
      stu_id,
      email,
      phone,
      password: hash,
      nickname,
    });
    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      user_id: login_id,
      name,
      stu_id,
      email,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
