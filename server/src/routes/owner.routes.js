const express = require("express");
const router = express.Router();
const redis = require("../config/redis");
const {
  getOwnerDashboard,
  getUserInsights,
  getEmployeeInsights,
  addEmployee,
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
router.post(
    "/add-employee",
    protect,
    isOwner,
    addEmployee
);

router.get("/debug/employee/:id", async (req, res) => {
    const val = await redis.get(`employee:session:${req.params.id}`);
    res.json({ value: val });
});

router.post("/track-employee", protect, async (req, res) => {
    try {
      const employeeId = req.user._id;
  
      const key = `employee:session:${employeeId}`;
  
      const current = Number(await redis.get(key) || 0);
      const updated = current + 5;
  
      await redis.set(key, updated, "EX", 60);
  
      res.json({ success: true, activeTime: updated });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
});
module.exports = router;