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
  try {
    return res.status(201).json({ success: true, message: req.user[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "info-controller에서 오류가 발생했습니다.",
    });
  }
};

exports.wikiHistory = async (req, res) => {
  try {
    const wikiHistory = await User.getWikiHistory(req.user[0].id);
    return res.status(201).json({ success: true, message: wikiHistory });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "wikiHistory-controller에서 오류가 발생했습니다.",
    });
  }
};

exports.badgeHistory = async (req, res) => {
  try {
    const badgeHistory = await User.getBadgeHistory(req.user[0].id);
    return res.status(201).json({ success: true, message: badgeHistory });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "badgeHistory-controller에서 오류가 발생했습니다.",
    });
  }
};

exports.setRepBadge = async (req, res) => {
  try {
    const result = await User.setRepBadge(
      req.body.rep_badge_id,
      req.user[0].id
    );
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "badgeHistory-controller에서 오류가 발생했습니다.",
    });
  }
};
//TODO: 프로필 변경에서 이름 항목 삭제
exports.editInfo = async (req, res) => {
  try {
    const { name, stu_id, nickname } = req.body;
    const result = await User.editInfo(name, stu_id, nickname, req.user[0].id);
    if (!result) {
      return res.status(500).json({
        success: false,
        message: `잘못된 접근입니다. 정보 수정에 실패하였습니다.`,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: `정보가 수정되었습니다.`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "badgeHistory-controller에서 오류가 발생했습니다.",
    });
  }
};
