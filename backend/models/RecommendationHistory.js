const mongoose = require("mongoose");

const recommendationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation",
      required: true,
    },

    status: {
      type: String,
      enum: ["recommended", "solved", "skipped"],
      default: "recommended",
    },

    solvedAt: {
      type: Date,
    },

    recommendedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "RecommendationHistory",
  recommendationHistorySchema,
);
