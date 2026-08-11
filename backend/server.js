require("dotenv").config();

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const app = require("./app");

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
