const pdfParse = require("pdf-parse");
const model = require("../config/gemini");
const LeetcodeStats = require("../models/LeetcodeStats");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const analyzeResume = async (req, res) => {
  try {
    const { role } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }

    let tracker = await ResumeAnalysis.findOne({
      userId: req.user.id,
    });

    const THREE_HOURS = 3 * 60 * 60 * 1000;
    const MAX_ATTEMPTS = 3;

    if (!tracker) {
      tracker = await ResumeAnalysis.create({
        userId: req.user.id,
        count: 0,
        windowStart: new Date(),
      });
    }

    const elapsed = Date.now() - new Date(tracker.windowStart).getTime();

    // Reset counter after 3 hours
    if (elapsed > THREE_HOURS) {
      tracker.count = 0;
      tracker.windowStart = new Date();
      await tracker.save();
    }

    // Check limit
    if (tracker.count >= MAX_ATTEMPTS) {
      const remainingTime = THREE_HOURS - elapsed;

      return res.status(429).json({
        message: "You have reached the limit of 3 resume analyses in 3 hours.",
        remainingTime,
      });
    }

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    const stats = await LeetcodeStats.findOne({
      userId: req.user.id,
    });

    const prompt = `
Analyze this candidate.

Target Role:
${role}

The candidate is a student applying for internships or entry-level roles.

Evaluate relative to students and fresh graduates, NOT senior engineers.

Do not heavily penalize for lack of professional experience.

Be realistic and strict.

Do not inflate scores.

Only assign scores above 85 if the candidate is truly exceptional for the target role.

Resume:
${resumeText}

LeetCode Stats:
Total Solved: ${stats?.totalSolved || 0}
Easy: ${stats?.easySolved || 0}
Medium: ${stats?.mediumSolved || 0}
Hard: ${stats?.hardSolved || 0}
Ranking: ${stats?.ranking || 0}

Return ONLY valid JSON.

IMPORTANT:
- Use double quotes only
- No markdown
- No explanations
- No trailing commas
- Must be JSON.parse compatible

All scores MUST be integers from 0 to 100.

{
  "matchScore": 0,
  "codingStrength": 0,
  "projectStrength": 0,
  "interviewReadiness": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "resumeImprovements": [],
  "roadmap": []
}
`;

    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(cleaned);
    } catch (err) {
      console.log("Invalid JSON returned by Gemini");
      console.log(cleaned);

      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    tracker.count += 1;
    await tracker.save();

    return res.status(200).json({
      ...analysis,
      remainingAttempts: MAX_ATTEMPTS - tracker.count,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  analyzeResume,
};
