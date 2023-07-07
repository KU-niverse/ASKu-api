const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const express = require("express");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
var appDir = path.dirname(require.main.filename);

exports.info = async (req, res) => {
  return res.status(201).json({ success: true, message: req.user[0] });
};

exports.wikiHistory = async (req, res) => {
  const wikiHistory = await User.getWikiHistory(req.user[0].id);
  return res.status(201).json({ success: true, message: wikiHistory });
};

exports.badgeHistory = async (req, res) => {
  const badgeHistory = await User.getBadgeHistory(req.user[0].id);
  return res.status(201).json({ success: true, message: badgeHistory });
};

exports.setRepBadge = async (req, res) => {
  const result = await User.setRepBadge(req.body.rep_badge_id, req.user[0].id);
  if (!result) {
    return res.status(500).json({
      success: false,
      message: `잘못된 접근입니다. 대표 배지 변경에 실패하였습니다.`,
    });
  } else {
    return res.status(201).json({
      success: true,
      message: `대표뱃지가 ${req.body.rep_badge_id}로 변경되었습니다.`,
    });
  }
};
