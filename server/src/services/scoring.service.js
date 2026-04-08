const redis = require("../config/redis");

const calculateScore = async (userId) => {
    const data = await redis.hgetall(`user:analytics:${userId}`);
  
    const timeSpent = Number(data.timeSpent || 0);
    const visits = Number(data.visits || 0);
    const interactions = Number(data.interactions || 0);
  
    const timeScore = Math.min(timeSpent / 60, 10);
    const visitScore = Math.min(visits, 10);
    const interactionScore = Math.min(interactions * 2, 10);
  
    return timeScore * 3 + visitScore * 3 + interactionScore * 4;
};
  
module.exports = {
    calculateScore
};