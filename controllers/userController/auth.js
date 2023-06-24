/* const express = require("express");
const bycrypt = require("bcrypt");
const User = require("../../models/user");

const { isSignedIn, isNotSignedIn } = require("../../middlewares/sign_in");
const { signUp, signIn, signOut } = require("../../controllers/user/auth");

exports.signUp = async (req, res, next) => {
  const { user_id, stu_id, user_name, password, phone, email } =
    req.body;
  try {
    const exUser = await User.find_user(user_id);
    const exRecommender = await User.find_user(recommender_id);
    if (exUser.length != 0) {
      return res.status(400).json({
        message: "이미 존재하는 아이디입니다.",
      });
    }
    else {
      const hash = await  bycrypt.hash(password, 12);

      await User.create({
        user_id, 
        name: user_name, 
        password: hash,
        phone,
        point: 0,
        bad: 0,
        is_admin: false,
        
      });
      return res.status(201).json({success: true, message: "회원가입이 완료되었습니다.", user_id: user_id});
    }

  
  } catch(error) {
    console.error(error);
    return next(error);
  }



};
 */
