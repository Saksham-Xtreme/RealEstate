const express = require("express");
const router = express.Router();

const {
  addInterest,
  checkInterest,
  getMyInterests,
} = require("../controllers/interest.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

// Add interest
router.post("/", protect, addInterest);

// Check interest
router.get("/:listingId", protect, checkInterest);

// Get all interests
router.get("/", protect, getMyInterests);

module.exports = router;