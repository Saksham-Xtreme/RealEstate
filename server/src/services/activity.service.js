const redis = require("../config/redis");
const { calculateScore } = require("./scoring.service");

exports.trackView = async (userId, listingId) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "visits", 1);

  const score = await calculateScore(userId);
  return score;
};

exports.trackTime = async (userId, listingId, duration) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "timeSpent", duration);

  const score = await calculateScore(userId);
  return score;
};

exports.trackInteraction = async (userId, listingId, type) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "interactions", 1);

  // Optional: store type separately
  await redis.hincrby(key, `interaction:${type}`, 1);

  const score = await calculateScore(userId);
  return score;
};