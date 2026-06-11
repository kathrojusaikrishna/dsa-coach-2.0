const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },

  count: {
    type: Number,
    default: 0,
  },

  windowStart: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
