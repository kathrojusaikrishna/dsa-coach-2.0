const helmet = require("helmet");

const { generalLimiter } = require("./middleware/rateLimiters");

const express = require("express");
const cors = require("cors");

const authMiddleware = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const errorHandler = require("./middleware/errorHandler");
const sanitizeRequest = require("./middleware/sanitize");

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(helmet());

app.use(express.json());

app.use(generalLimiter);
app.use(sanitizeRequest);

app.get("/", (req, res) => {
  res.send("DSA Coach app running");
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.use("/api/profile", profileRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/leetcode", leetcodeRoutes);

app.use("/api/recommendations", recommendationRoutes);

app.use("/api/resume", resumeRoutes);

app.use(errorHandler);

module.exports = app;
