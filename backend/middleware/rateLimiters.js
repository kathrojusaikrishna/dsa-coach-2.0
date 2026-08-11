const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  skip: () =>
    process.env.NODE_ENV === "test" && process.env.TEST_RATE_LIMIT !== "true",

  message: {
    message: "Too many requests. Please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  skip: () =>
    process.env.NODE_ENV === "test" && process.env.TEST_RATE_LIMIT !== "true",
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
};
