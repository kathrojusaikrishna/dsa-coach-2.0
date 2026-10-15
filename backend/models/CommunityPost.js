const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
  },
  { timestamps: true },
);

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["discussion", "question", "job"],
      default: "discussion",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    tags: {
      type: [String],
      default: [],
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],

    jobDetails: {
      company: { type: String, trim: true, maxlength: 150 },
      role: { type: String, trim: true, maxlength: 150 },
      location: { type: String, trim: true, maxlength: 150 },
      jobType: {
        type: String,
        enum: ["internship", "full-time", "part-time", "contract", "referral"],
      },
      applicationUrl: { type: String, trim: true, maxlength: 2048 },
      deadline: { type: Date, default: null },
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true },
);

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("CommunityPost", communityPostSchema);
