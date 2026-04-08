const express = require("express");
const router = express.Router();

const {
  getOwnerDashboard,
  getUserInsights,
  getEmployeeInsights,
} = require("../controllers/owner.controller");

const { protect } = require("../middlewares/auth.middleware");

// 🔴 Optional strict owner check
const isOwner = (req, res, next) => {
  if (req.userType !== "user" || req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner only" });
  }
  next();
};

// 🔷 Routes
router.get("/dashboard", protect, isOwner, getOwnerDashboard);
router.get("/users-insights", protect, isOwner, getUserInsights);
router.get("/employees-insights", protect, isOwner, getEmployeeInsights);

module.exports = router;