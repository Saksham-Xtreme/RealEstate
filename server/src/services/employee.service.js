const User = require("../models/user.model");
const redis = require("../config/redis");
const { calculateLeadScore, classifyLead } = require("./leadScore");

const getLeadsService = async () => {
  const users = await User.find({ role: "user" });

  if (!users.length) return [];

  const pipeline = redis.pipeline();

  users.forEach((user) => {
    pipeline.hgetall(`user:analytics:${user._id}`);
  });

  const results = await pipeline.exec();

  const leads = users.map((user, i) => {
    const data = results[i][1] || {};

    const visits = Number(data.visits) || 0;
    const timeSpent = Number(data.timeSpent) || 0;
    const interactions = Number(data.interactions) || 0;
    const lastActivity = data.lastActivity
      ? new Date(Number(data.lastActivity))
      : null;

    const leadScore =
      (Math.min(timeSpent / 60, 10) * 3) +
      (Math.min(visits, 10) * 3) +
      (Math.min(interactions * 2, 10) * 4);

    let leadCategory = "LOW";
    if (leadScore >= 60) leadCategory = "HIGH";
    else if (leadScore >= 25) leadCategory = "MEDIUM";

    const isActive =
      lastActivity && Date.now() - lastActivity.getTime() < 5 * 60 * 1000;

    const engagementScore = visits > 0 ? timeSpent / visits : 0;

    return {
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
    };
  });

  // 🔥 IMPORTANT: SORT
  leads.sort((a, b) => b.leadScore - a.leadScore);

  return leads;
};

module.exports = {
  getLeadsService,
};


