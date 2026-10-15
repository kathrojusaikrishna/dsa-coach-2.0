require("dotenv").config();

const http = require("http");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const app = require("./app");
const initializeSocket = require("./socket");

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT || 5000;
    const httpServer = http.createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
