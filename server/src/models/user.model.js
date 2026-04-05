// models/user.model.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },

  name: String,
  email: String,
  city: String,

  role: {
    type: String,
    enum: ["user", "employee", "owner"],
    default: "user"
  },

  isVerified: {
    type: Boolean,
    default: true // after OTP
  },

  lastLogin: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);