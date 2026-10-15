const mongoose = require("mongoose");
const CommunityPost = require("../models/CommunityPost");

const populatePost = (query) =>
  query
    .populate("author", "name email")
    .populate("comments.author", "name email");

const listPosts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 10));

    const filter = { status: "active" };

    if (["discussion", "question", "job"].includes(req.query.type)) {
      filter.type = req.query.type;
    }

    if (req.query.search) {
      const search = String(req.query.search).trim().slice(0, 100);
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { content: { $regex: escaped, $options: "i" } },
        { tags: { $regex: escaped, $options: "i" } },
        { "jobDetails.company": { $regex: escaped, $options: "i" } },
        { "jobDetails.role": { $regex: escaped, $options: "i" } },
      ];
    }

    const [posts, total] = await Promise.all([
      populatePost(
        CommunityPost.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
      ),
      CommunityPost.countDocuments(filter),
    ]);

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load community posts" });
  }
};

const createPost = async (req, res) => {
  try {
    const {
      type = "discussion",
      title,
      content,
      tags = [],
      jobDetails,
    } = req.body;

    if (!["discussion", "question", "job"].includes(type)) {
      return res.status(400).json({ message: "Invalid post type" });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 180 ||
      typeof content !== "string" ||
      !content.trim() ||
      content.trim().length > 10000
    ) {
      return res.status(400).json({
        message: "Title and content are required and must be within the limits",
      });
    }

    if (!Array.isArray(tags) || tags.length > 10) {
      return res.status(400).json({
        message: "Provide no more than 10 tags",
      });
    }

    const cleanTags = tags
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.trim().toLowerCase().slice(0, 30))
      .filter(Boolean);

    let cleanJobDetails;

    if (type === "job") {
      if (
        !jobDetails ||
        typeof jobDetails.company !== "string" ||
        !jobDetails.company.trim() ||
        typeof jobDetails.role !== "string" ||
        !jobDetails.role.trim()
      ) {
        return res.status(400).json({
          message: "Company and role are required for job posts",
        });
      }

      if (
        jobDetails.applicationUrl &&
        !/^https?:\/\/\S+$/i.test(jobDetails.applicationUrl)
      ) {
        return res.status(400).json({
          message: "Application URL must be a valid HTTP(S) URL",
        });
      }

      const allowedJobTypes = [
        "internship",
        "full-time",
        "part-time",
        "contract",
        "referral",
      ];

      if (jobDetails.jobType && !allowedJobTypes.includes(jobDetails.jobType)) {
        return res.status(400).json({ message: "Invalid job type" });
      }

      const deadline = jobDetails.deadline
        ? new Date(jobDetails.deadline)
        : null;

      if (deadline && Number.isNaN(deadline.getTime())) {
        return res.status(400).json({ message: "Invalid job deadline" });
      }

      cleanJobDetails = {
        company: jobDetails.company.trim().slice(0, 150),
        role: jobDetails.role.trim().slice(0, 150),
        location: String(jobDetails.location || "")
          .trim()
          .slice(0, 150),
        jobType: jobDetails.jobType || undefined,
        applicationUrl: jobDetails.applicationUrl || "",
        deadline,
      };
    }

    const post = await CommunityPost.create({
      author: req.user.id,
      type,
      title: title.trim(),
      content: content.trim(),
      tags: [...new Set(cleanTags)],
      jobDetails: cleanJobDetails,
    });

    const result = await populatePost(CommunityPost.findById(post._id));

    res.status(201).json({ post: result });
  } catch (error) {
    res.status(500).json({ message: "Unable to create post" });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (
      typeof content !== "string" ||
      !content.trim() ||
      content.trim().length > 3000
    ) {
      return res.status(400).json({
        message: "Comment must contain 1–3000 characters",
      });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post || post.status !== "active") {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: req.user.id,
      content: content.trim(),
    });

    await post.save();

    const result = await populatePost(CommunityPost.findById(post._id));

    res.status(201).json({ post: result });
  } catch (error) {
    res.status(500).json({ message: "Unable to add comment" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post || post.status !== "active") {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const alreadyLiked = post.likes.some((id) => id.equals(userId));

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.addToSet(userId);
    }

    await post.save();

    res.json({
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to update like" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete post" });
  }
};

module.exports = {
  listPosts,
  createPost,
  addComment,
  toggleLike,
  deletePost,
};
