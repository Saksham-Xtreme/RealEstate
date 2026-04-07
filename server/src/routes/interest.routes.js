const express = require("express");
const router = express.Router();

const {
  addInterest,
  checkInterest,
  getMyInterests,
} = require("../controllers/interest.controller");

const auth = require("../middlewares/auth.middleware");

// Add interest
router.post("/", auth, addInterest);

// Check interest
router.get("/:listingId", auth, checkInterest);

// Get all interests
router.get("/", auth, getMyInterests);

module.exports = router;