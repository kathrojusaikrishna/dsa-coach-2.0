const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

function initializeSocket(httpServer) {
  const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.id) {
        return next(new Error("Invalid token"));
      }

      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_conversation", async (data, acknowledge) => {
      const ack = typeof acknowledge === "function" ? acknowledge : () => {};

      try {
        const { conversationId } = data || {};

        if (!mongoose.isValidObjectId(conversationId)) {
          return ack({ ok: false, message: "Invalid conversation" });
        }

        const conversation = await Conversation.findById(conversationId);

        if (
          !conversation ||
          !conversation.participants.some(
            (id) => id.toString() === socket.userId,
          )
        ) {
          return ack({ ok: false, message: "Access denied" });
        }

        socket.join(`conversation:${conversationId}`);
        ack({ ok: true });
      } catch {
        ack({ ok: false, message: "Unable to join conversation" });
      }
    });

    socket.on("send_message", async (data, acknowledge) => {
      const ack = typeof acknowledge === "function" ? acknowledge : () => {};

      try {
        const { conversationId, content } = data || {};
        const text = typeof content === "string" ? content.trim() : "";

        if (
          !mongoose.isValidObjectId(conversationId) ||
          !text ||
          text.length > 5000
        ) {
          return ack({ ok: false, message: "Invalid message" });
        }

        const conversation = await Conversation.findById(conversationId);

        if (
          !conversation ||
          !conversation.participants.some(
            (id) => id.toString() === socket.userId,
          )
        ) {
          return ack({ ok: false, message: "Access denied" });
        }

        // Persist before acknowledging or broadcasting.
        const message = await Message.create({
          conversation: conversation._id,
          sender: socket.userId,
          content: text,
        });

        conversation.lastMessage = message._id;
        conversation.updatedAt = new Date();
        await conversation.save();

        const populated = await Message.findById(message._id)
          .populate("sender", "name email")
          .lean();

        io.to(`conversation:${conversationId}`).emit("new_message", populated);

        ack({ ok: true, message: populated });
      } catch {
        ack({ ok: false, message: "Unable to send message" });
      }
    });
  });

  return io;
}

module.exports = initializeSocket;
