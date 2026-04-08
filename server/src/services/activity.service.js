const redis = require("../config/redis");
const { calculateScore } = require("./scoring.service");

const SESSION_TTL = 60 * 60; // 1 hour

// console.log("USER:", req.user);

const trackView = async (userId, listingId) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "visits", 1);
  await redis.hset(key, "lastActivity", Date.now());
  await redis.expire(key, SESSION_TTL);
  
  console.log("TRACK VIEW HIT");

  const score = await calculateScore(userId);
  return score;
};

const trackTime = async (userId, listingId, duration) => {
  const key = `user:analytics:${userId}`;

  const safeDuration = Number(duration) || 0;

  await redis.hincrby(key, "timeSpent", safeDuration);
  await redis.hset(key, "lastActivity", Date.now());
  

  const score = await calculateScore(userId);
  return score;
};

const trackInteraction = async (userId, listingId, type) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "interactions", 1);

  if (type) {
    await redis.hincrby(key, `interaction:${type}`, 1);
  }

  await redis.hset(key, "lastActivity", Date.now());
  

  const score = await calculateScore(userId);
  return score;
};

module.exports = {
  trackView,
  trackTime,
  trackInteraction,
};