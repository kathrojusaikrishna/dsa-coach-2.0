require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

//middlewares
const authMiddleware = require("./middleware/authMiddleware");

//routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(process.env.PORT, () => {
    console.log("server is running...");
  });
};

app.use(cors());
app.use(express.json());

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

startServer();
