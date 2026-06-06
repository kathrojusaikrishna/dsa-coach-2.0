const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getLeetcodeStats } = require("../controllers/leetcodeController");

router.get("/stats", authMiddleware, getLeetcodeStats);

module.exports = router;
