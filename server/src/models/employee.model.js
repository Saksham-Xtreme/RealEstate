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

    // Assigned by owner
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // owner/admin
    },

    lastLogin: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);