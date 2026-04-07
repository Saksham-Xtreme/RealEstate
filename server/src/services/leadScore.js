function calculateLeadScore({ timeSpent = 0, visits = 0, interactions = 0 }) {
    return (
      timeSpent * 0.5 +
      visits * 2 +
      interactions * 3
    );
}
  
function classifyLead(score) {
    if (score > 80) return "HIGH";
    if (score > 40) return "MEDIUM";
    return "LOW";
}
  
module.exports = { calculateLeadScore, classifyLead };