const Recommendation = require("../models/Recommendation");
const LeetcodeStats = require("../models/LeetcodeStats");
const RecommendationHistory = require("../models/RecommendationHistory");

const getRecommendations = async (req, res) => {
  try {
    const stats = await LeetcodeStats.findOne({
      userId: req.user.id,
    }).lean();

    if (!stats) {
      return res.status(404).json({
        message: "Leetcode stats not found",
      });
    }

    let difficulty;

    if (stats.totalSolved < 150) {
      difficulty = "Easy";
    } else if (stats.totalSolved < 500) {
      difficulty = "Medium";
    } else {
      difficulty = "Hard";
    }

    const history = await RecommendationHistory.find({
      userId: req.user.id,
      status: {
        $in: ["solved", "skipped"],
      },
    }).lean();

    const excludedProblemIds = history.map((item) => item.problemId);

    const solvedHistory = await RecommendationHistory.find({
      userId: req.user.id,
      status: "solved",
    }).populate("problemId");

    const topicCount = {};

    solvedHistory.forEach((item) => {
      if (!item.problemId) return;

      item.problemId.topic.forEach((topic) => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
    });

    const weakTopics = Object.entries(topicCount)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    let problems;

    if (weakTopics.length > 0) {
      problems = await Recommendation.aggregate([
        {
          $match: {
            difficulty,
            topic: {
              $in: weakTopics,
            },
            _id: {
              $nin: excludedProblemIds,
            },
          },
        },
        {
          $sample: {
            size: 5,
          },
        },
      ]);
    } else {
      problems = await Recommendation.aggregate([
        {
          $match: {
            difficulty,
            _id: {
              $nin: excludedProblemIds,
            },
          },
        },
        {
          $sample: {
            size: 5,
          },
        },
      ]);
    }

    await RecommendationHistory.bulkWrite(
      problems.map((problem) => ({
        updateOne: {
          filter: {
            userId: req.user.id,
            problemId: problem._id,
          },
          update: {
            $setOnInsert: {
              status: "recommended",
              recommendedAt: new Date(),
            },
          },
          upsert: true,
        },
      })),
    );

    const recommendations = problems.map((problem) => {
      const matchedTopics = problem.topic.filter((topic) =>
        weakTopics.includes(topic),
      );

      return {
        ...problem,
        reason:
          matchedTopics.length > 0
            ? `Weak topic: ${matchedTopics.join(", ")}`
            : `Recommended ${difficulty} problem`,
      };
    });

    res.status(200).json({
      level: difficulty,
      totalSolved: stats.totalSolved,
      weakTopics,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markSolved = async (req, res) => {
  try {
    const { id } = req.params;

    await RecommendationHistory.findOneAndUpdate(
      {
        userId: req.user.id,
        problemId: id,
      },
      {
        status: "solved",
        solvedAt: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.status(200).json({
      message: "Problem marked as solved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markSkipped = async (req, res) => {
  try {
    const { id } = req.params;

    await RecommendationHistory.findOneAndUpdate(
      {
        userId: req.user.id,
        problemId: id,
      },
      {
        status: "skipped",
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.status(200).json({
      message: "Problem marked as skipped",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await RecommendationHistory.find({
      userId: req.user.id,
    }).populate("problemId");

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getForgotProblems = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const forgottenProblems = await RecommendationHistory.find({
      userId: req.user.id,
      status: "solved",
      solvedAt: {
        $lt: thirtyDaysAgo,
      },
    }).populate("problemId");

    const result = forgottenProblems.map((problem) => {
      const daysSinceSolved = Math.floor(
        (Date.now() - new Date(problem.solvedAt)) / (1000 * 60 * 60 * 24),
      );

      let retention;
      let priority;

      if (daysSinceSolved <= 30) {
        retention = "Good";
        priority = "Low";
      } else if (daysSinceSolved <= 60) {
        retention = "Weak";
        priority = "Medium";
      } else {
        retention = "Forgotten";
        priority = "High";
      }

      return {
        title: problem.problemId.title,
        topic: problem.problemId.topic,
        difficulty: problem.problemId.difficulty,
        link: problem.problemId.link,
        daysSinceSolved,
        retention,
        priority,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMemoryScore = async (req, res) => {
  try {
    const solvedProblems = await RecommendationHistory.find({
      userId: req.user.id,
      status: "solved",
    });

    if (solvedProblems.length === 0) {
      return res.json({
        memoryStrength: 0,
        fresh: 0,
        good: 0,
        weak: 0,
        forgotten: 0,
      });
    }

    let fresh = 0;
    let good = 0;
    let weak = 0;
    let forgotten = 0;

    for (const problem of solvedProblems) {
      const daysSinceSolved = Math.floor(
        (Date.now() - new Date(problem.solvedAt)) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceSolved <= 7) {
        fresh++;
      } else if (daysSinceSolved <= 30) {
        good++;
      } else if (daysSinceSolved <= 60) {
        weak++;
      } else {
        forgotten++;
      }
    }

    const total = solvedProblems.length;

    const score =
      (fresh * 100 + good * 75 + weak * 40 + forgotten * 10) / total;

    res.json({
      memoryStrength: Math.round(score),
      fresh,
      good,
      weak,
      forgotten,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getReadinessScore = async (req, res) => {
  try {
    const stats = await LeetcodeStats.findOne({
      userId: req.user.id,
    });

    if (!stats) {
      return res.status(404).json({
        message: "Stats not found",
      });
    }

    const memory = await RecommendationHistory.find({
      userId: req.user.id,
      status: "solved",
    });

    const memoryStrength =
      memory.length === 0
        ? 0
        : Math.min(100, Math.round((memory.length / stats.totalSolved) * 100));

    const solvedScore = Math.min(
      100,
      Math.round((stats.totalSolved / 500) * 100),
    );

    const readiness = Math.round(solvedScore * 0.7 + memoryStrength * 0.3);

    res.json({
      readiness,
      totalSolved: stats.totalSolved,
      memoryStrength,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWeakTopics = async (req, res) => {
  try {
    const history = await RecommendationHistory.find({
      userId: req.user.id,
      status: "solved",
    }).populate("problemId");

    const topicCount = {};

    history.forEach((item) => {
      if (!item.problemId) return;

      item.problemId.topic.forEach((topic) => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
    });

    const weakTopics = Object.entries(topicCount)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5)
      .map(([topic, count]) => ({
        topic,
        solvedCount: count,
      }));

    res.status(200).json({
      weakTopics,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
  markSkipped,
  markSolved,
  getHistory,
  getForgotProblems,
  getMemoryScore,
  getReadinessScore,
  getWeakTopics,
};
