const mongoose = require("mongoose");
require("dotenv").config();

const Recommendation = require("./models/Recommendation");
const connectDB = require("./config/db");

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    link: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    link: "https://leetcode.com/problems/binary-search/",
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "Heap",
    link: "https://leetcode.com/problems/top-k-frequent-elements/",
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Array",
    link: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graph",
    link: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    title: "LRU Cache",
    difficulty: "Hard",
    topic: "Design",
    link: "https://leetcode.com/problems/lru-cache/",
  },
];

const seed = async () => {
  await connectDB();

  await Recommendation.deleteMany();

  await Recommendation.insertMany(problems);

  console.log("Seeded");

  process.exit();
};

seed();
