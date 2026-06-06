const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    leetcodeUsername: {
      type: String,
      default: "",
    },

    codeforcesUsername: {
      type: String,
      default: "",
    },

    gfgUsername: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", ProfileSchema);
