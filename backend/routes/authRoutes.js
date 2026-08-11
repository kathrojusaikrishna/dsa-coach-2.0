const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { register, login } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiters");
const { registerSchema, loginSchema } = require("../validators/authValidators");

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

module.exports = router;
