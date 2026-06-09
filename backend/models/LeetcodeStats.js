const mongoose = require("mongoose");

const leetcodeStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },

  totalSolved: Number,
  easySolved: Number,
  mediumSolved: Number,
  hardSolved: Number,

  ranking: Number,

  lastSynced: {
    type: Date,
    default: Date.now,
  },
});

leetcodeStatsSchema.index({
  userId: 1,
});

module.exports = mongoose.model("LeetcodeStats", leetcodeStatsSchema);
