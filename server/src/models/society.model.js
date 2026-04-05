// models/society.model.js

const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  city: {
    type: String,
    required: true
  },

  location: {
    lat: Number,
    lng: Number
  },

  tags: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Society", societySchema);