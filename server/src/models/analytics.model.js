// models/analytics.model.js

const mongoose = require("mongoose");
const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // 🔥 important (one doc per user)
  },

  visits: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 },
  interactions: { type: Number, default: 0 },

  leadScore: { type: Number, default: 0 },

  societiesViewed: [String],

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);