const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL;

// ioredis will automatically parse the URL and apply TLS if it starts with rediss://
const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  
  // NOTE: If you are using a managed service (like Heroku or Render) 
  // that uses self-signed certificates, you may need to uncomment the block below.
  // Otherwise, leave it out.
  /*
  tls: {
    rejectUnauthorized: false
  }
  */
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

module.exports = redis;