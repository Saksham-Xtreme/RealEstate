const redis = require("../config/redis");
const { calculateLeadScore } = require("./leadScore");
const Analytics = require("../models/analytics.model"); // 🔥 ADD THIS

const trackView = async (userId, listingId) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "visits", 1);
  await redis.hset(key, "lastActivity", Date.now());

  return await updateAndScore(userId);
};

const trackTime = async (userId, listingId, duration) => {
  const key = `user:analytics:${userId}`;

  const safeDuration = Number(duration) || 0;

  await redis.hincrby(key, "timeSpent", safeDuration);
  await redis.hset(key, "lastActivity", Date.now());

  return await updateAndScore(userId);
};

const trackInteraction = async (userId, listingId, type) => {
  const key = `user:analytics:${userId}`;

  await redis.hincrby(key, "interactions", 1);

  if (type) {
    await redis.hincrby(key, `interaction:${type}`, 1);
  }

  await redis.hset(key, "lastActivity", Date.now());

  return await updateAndScore(userId);
};



// 🔥 MAIN FUNCTION (Redis + Mongo Sync + Scoring)
const updateAndScore = async (userId) => {
  const key = `user:analytics:${userId}`;
  const data = await redis.hgetall(key);

  const visits = Number(data.visits) || 0;
  const timeSpent = Number(data.timeSpent) || 0;
  const interactions = Number(data.interactions) || 0;

  const lastActivity = data.lastActivity
    ? new Date(Number(data.lastActivity))
    : null;

  // 🔥 Extract interaction types
  const interactionTypes = {};

  Object.keys(data).forEach((k) => {
    if (k.startsWith("interaction:")) {
      const type = k.split(":")[1];
      interactionTypes[type] = Number(data[k]) || 0;
    }
  });

  // 🔥 Calculate score
  const score = calculateLeadScore({
    timeSpent,
    visits,
    interactions,
    lastActivity,
    interactionTypes,
  });

  // 🔥 SAVE TO MONGO (CRITICAL FIX)
  await Analytics.findOneAndUpdate(
    { user: userId },
    {
      visits,
      timeSpent,
      interactions,
      interactionTypes,
      leadScore: score,
      updatedAt: new Date(),
    },
    { upsert: true }
  );

  return score;
};

module.exports = {
  trackView,
  trackTime,
  trackInteraction,
};