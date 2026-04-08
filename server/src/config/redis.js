const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL;


const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  

});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

module.exports = redis;