const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },

  topic: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
