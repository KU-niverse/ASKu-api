import express from 'express';
import { popularRankGetMid } from "../controllers/searchController";

const router = express.Router();

// GET /search/popular
router.get("/popular", popularRankGetMid);

export default router;
