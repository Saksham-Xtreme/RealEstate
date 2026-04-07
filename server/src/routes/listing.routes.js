const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getListingById
} = require("../controllers/listing.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

// 🔷 ROUTES
router.post("/", protect, authorize("owner"), createListing);

router.get("/", getListings);
router.get("/:id", getListingById);

module.exports = router;