const calculateLeadScore = ({ timeSpent, visits, interactions }) => {
    const timeScore = Math.min(timeSpent / 60, 10);
    const visitScore = Math.min(visits, 10);
    const interactionScore = Math.min(interactions * 2, 10);
  
    return timeScore * 3 + visitScore * 3 + interactionScore * 4;
};
  
function classifyLead(score) {
    if (score >= 70) return "HIGH";
    if (score >= 30) return "MEDIUM";
    return "LOW";
}
  
module.exports = { calculateLeadScore, classifyLead };