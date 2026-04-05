// models/analytics.model.js

const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  visits: Number,
  timeSpent: Number,
  interactions: Number,

  leadScore: Number,

  societiesViewed: [String],

  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Analytics", analyticsSchema);