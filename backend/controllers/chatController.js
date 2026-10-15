const mongoose = require("mongoose");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const isParticipant = (conversation, userId) =>
  conversation.participants.some(
    (participant) => participant.toString() === userId,
  );

const findUsers = async (req, res) => {
  try {
    const search = String(req.query.search || "")
      .trim()
      .slice(0, 60);

    if (search.length < 2) {
      return res.json({ users: [] });
    }

    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ],
    })
      .select("name email")
      .limit(10)
      .lean();

    res.json({ users });
  } catch {
    res.status(500).json({ message: "Unable to find users" });
  }
};

const listConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ conversations });
  } catch {
    res.status(500).json({
      message: "Unable to load conversations",
    });
  }
};

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.isValidObjectId(userId) || userId === req.user.id) {
      return res.status(400).json({
        message: "Choose a valid user other than yourself",
      });
    }

    const userExists = await User.exists({ _id: userId });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const participants = [req.user.id, userId];

    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 },
    })
      .populate("participants", "name email")
      .populate("lastMessage");

    if (!conversation) {
      try {
        conversation = await Conversation.create({
          participants,
        });
      } catch (error) {
        // Another simultaneous request may have created it.
        if (error.code !== 11000) throw error;

        conversation = await Conversation.findOne({
          participants: { $all: participants, $size: 2 },
        });
      }

      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name email")
        .populate("lastMessage");
    }

    res.status(200).json({ conversation });
  } catch {
    res.status(500).json({
      message: "Unable to create conversation",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !isParticipant(conversation, req.user.id)) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

    const messages = await Message.find({
      conversation: conversationId,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "name email")
      .lean();

    res.json({
      messages: messages.reverse(),
      page,
      hasMore:
        (await Message.countDocuments({
          conversation: conversationId,
        })) >
        page * limit,
    });
  } catch {
    res.status(500).json({ message: "Unable to load messages" });
  }
};

const markRead = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation || !isParticipant(conversation, req.user.id)) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const result = await Message.updateMany(
      {
        conversation: conversation._id,
        sender: { $ne: req.user.id },
        readAt: null,
      },
      { $set: { readAt: new Date() } },
    );

    res.json({ updated: result.modifiedCount });
  } catch {
    res.status(500).json({ message: "Unable to mark messages as read" });
  }
};

module.exports = {
  findUsers,
  listConversations,
  createConversation,
  getMessages,
  markRead,
};
