const express = require("express");
const router = express.Router();
const axios = require("axios");
const model = require("../config/gemini");

const upload = require("../middleware/uploadResume");

const { analyzeResume } = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/analyze", authMiddleware, upload.single("resume"), analyzeResume);

module.exports = router;
