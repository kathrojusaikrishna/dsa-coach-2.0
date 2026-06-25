const { createClient } = require("redis");

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.error("redis error : ", err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("redis connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { redisClient, connectRedis };
