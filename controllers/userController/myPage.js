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
