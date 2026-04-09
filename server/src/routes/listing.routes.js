const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
} = require("../controllers/listing.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 🔷 CREATE (EMPLOYEE ONLY)
router.post(
  "/",
  protect,
  authorize("employee"),
  upload.array("images", 5),
  createListing
);

// 🔷 GET MY LISTINGS
router.get(
  "/my",
  protect,
  authorize("employee"),
  getMyListings
);

// 🔷 PUBLIC
router.get("/", getListings);
router.get("/:id", getListingById);

// edit
router.put(
  "/:id",
  protect,
  authorize("employee"),
  updateListing
);

module.exports = router;