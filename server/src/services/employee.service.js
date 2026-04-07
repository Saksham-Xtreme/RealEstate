const User = require("../models/user.model");
const redis = require("../config/redis");
const { calculateLeadScore, classifyLead } = require("./leadScore");

exports.getLeadsService = async () => {
  try {
    // 1. Fetch users from Mongo
    const users = await User.find({}, "name email phone createdAt").lean();

    if (!users.length) return [];

    // 2. Prepare Redis pipeline
    const pipeline = redis.pipeline();

    users.forEach((user) => {
      pipeline.hgetall(`user:analytics:${user._id}`);
    });

    // 3. Execute pipeline
    const redisResults = await pipeline.exec();

    // 4. Merge data
    const leads = users.map((user, index) => {
      const analytics = redisResults[index][1] || {};

      const timeSpent = Number(analytics.timeSpent || 0);
      const visits = Number(analytics.visits || 0);
      const interactions = Number(analytics.interactions || 0);
      const lastActivity = analytics.lastActivity
        ? new Date(Number(analytics.lastActivity))
        : null;

      const leadScore = calculateLeadScore({
        timeSpent,
        visits,
        interactions,
      });

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,

        visits,
        timeSpent,
        interactions,
        lastActivity,

        leadScore,
        leadCategory: classifyLead(leadScore),
      };
    });

    // 5. Sort by lead score DESC
    leads.sort((a, b) => b.leadScore - a.leadScore);

    return leads;
  } catch (error) {
    console.error("GET LEADS SERVICE ERROR:", error);
    throw error;
  }
};