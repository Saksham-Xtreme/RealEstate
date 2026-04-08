const User = require("../models/user.model");
const redis = require("../config/redis");
const { calculateLeadScore, classifyLead } = require("./leadScore");

const ACTIVE_WINDOW = 5 * 60 * 1000;

exports.getLeadsService = async ({ page = 1, limit = 20 } = {}) => {
  try {
    const skip = (page - 1) * limit;

    const users = await User.find({}, "name email phone createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    if (!users.length) return [];

    const pipeline = redis.pipeline();

    users.forEach((user) => {
      pipeline.hgetall(`user:analytics:${user._id}`);
    });

    const redisResults = await pipeline.exec();

    const leads = users
      .map((user, index) => {
        const [err, analyticsRaw] = redisResults[index];

        if (err) {
          console.error(`Redis error for user ${user._id}:`, err);
        }

        const analytics = analyticsRaw || {};

        const timeSpent = safeNumber(analytics.timeSpent);
        const visits = safeNumber(analytics.visits);
        const interactions = safeNumber(analytics.interactions);

        // 🔴 Skip useless users
        if (!visits && !timeSpent && !interactions) return null;

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

          isActive:
            lastActivity &&
            Date.now() - lastActivity.getTime() < ACTIVE_WINDOW,

          engagementScore: visits ? timeSpent / visits : 0,
        };
      })
      .filter(Boolean);

    leads.sort((a, b) => b.leadScore - a.leadScore);

    return leads;
  } catch (error) {
    console.error("GET LEADS SERVICE ERROR:", error);
    throw error;
  }
};