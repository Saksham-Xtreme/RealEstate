const calculateLeadScore = (data) => {
    const {
      timeSpent = 0,
      visits = 0,
      interactions = 0,
      lastActivity,
      interactionTypes = {},
    } = data;
  
    // 1️⃣ Time Score (max 30)
    const timeScore = Math.min(timeSpent / 60, 10) * 3;
  
    // 2️⃣ Visit Score (max 20)
    const visitScore = Math.min(visits, 10) * 2;
  
    // 3️⃣ Interaction Score (max 40)
    const interactionScore =
      (interactionTypes["interest_click"] || 0) * 10 +
      (interactionTypes["click"] || 0) * 4 +
      (interactionTypes["image_click"] || 0) * 3 +
      (interactionTypes["scroll_50"] || 0) * 2;
  
    const cappedInteractionScore = Math.min(interactionScore, 40);
  
    // 4️⃣ Recency Boost (max 20)
    let recencyScore = 0;
    if (lastActivity) {
      const minutesAgo = (Date.now() - new Date(lastActivity).getTime()) / 60000;
  
      if (minutesAgo < 5) recencyScore = 20;
      else if (minutesAgo < 30) recencyScore = 10;
      else if (minutesAgo < 120) recencyScore = 5;
    }
  
    // 5️⃣ Engagement Score (max 10)
    const engagementScore =
      visits > 0 ? Math.min((timeSpent / visits) / 10, 10) : 0;
  
    const finalScore =
      timeScore +
      visitScore +
      cappedInteractionScore +
      recencyScore +
      engagementScore;
  
    return Math.round(finalScore);
};
  
const classifyLead = (score) => {
    if (score >= 80) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
};
  
module.exports = { calculateLeadScore, classifyLead };