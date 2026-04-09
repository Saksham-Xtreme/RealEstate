const redis = require("../config/redis");
const Analytics = require("../models/analytics.model");
const { calculateLeadScore } = require("../services/leadScore");

const syncAnalytics = async () => {
  try {
    const keys = await redis.keys("user:analytics:*");

    for (const key of keys) {
      const userId = key.split(":")[2];
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

      // 🔥 Use NEW scoring
      const leadScore = calculateLeadScore({
        timeSpent,
        visits,
        interactions,
        lastActivity,
        interactionTypes,
      });

      await Analytics.findOneAndUpdate(
        { user: userId },
        {
          visits,
          timeSpent,
          interactions,
          interactionTypes,
          leadScore,
          updatedAt: new Date(),
        },
        { upsert: true }
      );
    }

    console.log("✅ Analytics synced to MongoDB");
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
};

module.exports = syncAnalytics;