const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getRecommendations,
  markSkipped,
  markSolved,
  getHistory,
  getForgotProblems,
  getMemoryScore,
  getReadinessScore,
  getWeakTopics,
} = require("../controllers/recommendationController");

router.get("/", authMiddleware, getRecommendations);

router.post("/:id/solve", authMiddleware, markSolved);

router.post("/:id/skip", authMiddleware, markSkipped);

router.get("/history", authMiddleware, getHistory);

router.get("/forgotten", authMiddleware, getForgotProblems);

router.get("/memory-score", authMiddleware, getMemoryScore);

router.get("/readiness", authMiddleware, getReadinessScore);

router.get("/weak-topics", authMiddleware, getWeakTopics);

module.exports = router;
