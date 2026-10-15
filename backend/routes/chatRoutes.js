const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

const {
  findUsers,
  listConversations,
  createConversation,
  getMessages,
  markRead,
} = require("../controllers/chatController");

const router = express.Router();

router.use(authMiddleware);

router.get("/users", findUsers);
router.get("/conversations", listConversations);
router.post("/conversations", createConversation);

router.get(
  "/conversations/:id/messages",
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }
    next();
  },
  getMessages,
);

router.post(
  "/conversations/:id/read",
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }
    next();
  },
  markRead,
);

module.exports = router;
