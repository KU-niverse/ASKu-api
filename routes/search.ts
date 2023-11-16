const { popularRankGetMid } = require("../controllers/searchController");

// GET /search/popular
router.get("/popular", popularRankGetMid);

module.exports = router;