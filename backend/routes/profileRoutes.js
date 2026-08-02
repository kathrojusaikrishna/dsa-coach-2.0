const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  CreateProfile,
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.post("/", authMiddleware, CreateProfile);
router.put("/update", authMiddleware, updateProfile);
router.get("/", authMiddleware, getProfile);

module.exports = router;
