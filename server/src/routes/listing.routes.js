const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getListingById
} = require("../controllers/listing.controller");

const auth = require("../middlewares/auth.middleware");

// 🔷 ROUTES
router.post("/", auth, createListing);
router.get("/", getListings);
router.get("/:id", getListingById);

module.exports = router;