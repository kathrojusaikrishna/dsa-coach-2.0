const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    topic: [
      {
        type: String,
        required: true,
      },
    ],

    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
recommendationSchema.index({ difficulty: 1 });
recommendationSchema.index({ topic: 1 });

module.exports = mongoose.model("Recommendation", recommendationSchema);
