const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  CreateProfile,
  getProfile,
} = require("../controllers/profileController");

router.post("/", authMiddleware, CreateProfile);
router.get("/", authMiddleware, getProfile);

module.exports = router;
