const express = require("express");
const router = express.Router();

const {
  viewListing,
  timeSpent,
  interact,
} = require("../controllers/activity.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

// 🔷 ROUTES
router.post("/view", protect, viewListing);
router.post("/time", protect, timeSpent);
router.post("/interact", protect, interact);

module.exports = router;