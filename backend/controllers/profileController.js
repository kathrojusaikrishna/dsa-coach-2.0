const { redisClient } = require("../config/redis");
const Profile = require("../models/Profile");

const CreateProfile = async (req, res) => {
  try {
    const { leetcodeUsername } = req.body;

    const existingProfile = await Profile.findOne({
      userId: req.user.id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    const profile = await Profile.create({
      userId: req.user.id,
      leetcodeUsername,
    });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { leetcodeUsername } = req.body;

    const existingProfile = await Profile.findOne({
      userId: req.user.id,
    });

    if (!existingProfile) {
      return res.status(400).json({
        message: "Profile does not exist, create one",
      });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { leetcodeUsername },
      { upsert: true, returnDocument: "after" },
    );

    await redisClient.del(`leetcode:${req.user.id}`);

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { CreateProfile, updateProfile, getProfile };
