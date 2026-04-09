const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
  
      role: {
        type: String,
        default: "employee",
      },
  
      phone: String,
  
      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  
      lastLogin: Date,
  
      isActive: {
        type: Boolean,
        default: true,
      },
  
      // 🔥 NEW: Performance Metrics (Persistent)
      totalLeadsHandled: {
        type: Number,
        default: 0,
      },
  
      totalConversions: {
        type: Number,
        default: 0,
      },
  
      // 🔥 NEW: Last Active Snapshot (fallback if Redis fails)
      lastActiveAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);