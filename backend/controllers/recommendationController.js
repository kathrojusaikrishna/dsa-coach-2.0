const Recommendation = require("../models/Recommendation");
const LeetcodeStats = require("../models/LeetcodeStats");

const getRecommendations = async (req, res) => {
  try {
    const stats = await LeetcodeStats.findOne({ userId: req.user.id });

    if (!stats) {
      return res.status(404).json({
        message: "Leetcode stats not found",
      });
    }

    let difficulty;

    if (stats.totalSolved < 150) difficulty = "Easy";
    else if (stats.totalSolved < 500) difficulty = "Medium";
    else difficulty = "Hard";

    const problems = await Recommendation.aggregate([
      {
        $match: { difficulty },
      },
      {
        $sample: { size: 3 },
      },
    ]);

    res.json({
      level: difficulty,
      totalSolved: stats.totalSolved,
      recommendations: problems,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getRecommendations };
