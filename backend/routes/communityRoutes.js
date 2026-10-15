const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

const {
  listPosts,
  createPost,
  addComment,
  toggleLike,
  deletePost,
} = require("../controllers/communityController");

const router = express.Router();

router.use(authMiddleware);

router.get("/posts", listPosts);
router.post("/posts", createPost);

router.post(
  "/posts/:id/comments",
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    next();
  },
  addComment,
);

router.post(
  "/posts/:id/like",
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    next();
  },
  toggleLike,
);

router.delete(
  "/posts/:id",
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    next();
  },
  deletePost,
);

module.exports = router;
