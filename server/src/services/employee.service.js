const User = require("../models/user.model");
const redis = require("../config/redis");
const Analytics = require("../models/analytics.model"); // 🔥 ADD THIS

const { calculateLeadScore, classifyLead } = require("./leadScore");

const getLeadsService = async () => {
  const users = await User.find({ role: "user" });

  if (!users.length) return [];

  const pipeline = redis.pipeline();

  users.forEach((user) => {
    pipeline.hgetall(`user:analytics:${user._id}`);
  });

  const results = await pipeline.exec();

  const leads = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const data = results[i][1];

    let visits = 0;
    let timeSpent = 0;
    let interactions = 0;
    let lastActivity = null;

    // ✅ CASE 1: Redis data exists
    if (data && Object.keys(data).length > 0) {
      visits = Number(data.visits) || 0;
      timeSpent = Number(data.timeSpent) || 0;
      interactions = Number(data.interactions) || 0;
      lastActivity = data.lastActivity
        ? new Date(Number(data.lastActivity))
        : null;
    } 
    // 🔥 CASE 2: FALLBACK to Mongo
    else {
      const mongoData = await Analytics.findOne({ user: user._id });

      if (mongoData) {
        visits = mongoData.visits || 0;
        timeSpent = mongoData.timeSpent || 0;
        interactions = mongoData.interactions || 0;
        lastActivity = mongoData.updatedAt || null;
      }
    }

    const leadScore = calculateLeadScore({
      timeSpent,
      visits,
      interactions,
    });

    const leadCategory = classifyLead(leadScore);

    const isActive =
      lastActivity &&
      Date.now() - new Date(lastActivity).getTime() < 5 * 60 * 1000;

    const engagementScore = visits > 0 ? timeSpent / visits : 0;

    leads.push({
      _id: user._id,
      email: user.email,
      phone: user.phone,
      visits,
      timeSpent,
      interactions,
      lastActivity,
      leadScore,
      leadCategory,
      isActive,
      engagementScore,
    });
  }

  // 🔥 SORT
  leads.sort((a, b) => b.leadScore - a.leadScore);

  return leads;
};

module.exports = {
  getLeadsService,
};