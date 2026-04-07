const express = require("express");
const router = express.Router();

const {
  addInterest,
  checkInterest,
  getMyInterests,
} = require("../controllers/interest.controller");

const auth = require("../middlewares/auth.middleware");

// POST → add interest
router.post("/", auth, addInterest);

// GET → check if user interested
router.get("/:listingId", auth, checkInterest);

// GET → get all interests
router.get("/", auth, getMyInterests);

module.exports = router;