const express = require("express");
const { popularRankGetMid } = require("../controllers/searchController");

const router = express.Router();

// GET /search/popular
router.get("/popular", popularRankGetMid);

module.exports = router;