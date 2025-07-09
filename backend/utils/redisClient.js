const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect();

module.exports = redisClient;
