const axios = require("axios");
const LeetcodeStats = require("../models/LeetcodeStats");
const Profile = require("../models/Profile");

const getLeetcodeStats = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const username = profile.leetcodeUsername;

    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username

            profile {
              ranking
            }

            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: {
        username,
      },
    };

    const response = await axios.post("https://leetcode.com/graphql", query);

    const userData = response.data.data.matchedUser;

    const stats = userData.submitStats.acSubmissionNum;

    const totalSolved = stats.find((s) => s.difficulty === "All")?.count || 0;

    const easySolved = stats.find((s) => s.difficulty === "Easy")?.count || 0;

    const mediumSolved =
      stats.find((s) => s.difficulty === "Medium")?.count || 0;

    const hardSolved = stats.find((s) => s.difficulty === "Hard")?.count || 0;

    const ranking = userData.profile.ranking;

    const savedStats = await LeetcodeStats.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        ranking,
        lastSynced: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.status(200).json(savedStats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getLeetcodeStats };
