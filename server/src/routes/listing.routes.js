const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  archiveListing,
  restoreListing,
} = require("../controllers/listing.controller");

const {
  protect,
  authorize
} = require("../middlewares/auth.middleware");

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


// 🔷 ARCHIVE LISTING (OWNER + EMPLOYEE)
router.patch(
  "/:id/archive",
  protect,
  authorize("owner", "employee"),
  archiveListing
);


// 🔷 RESTORE LISTING (OWNER + EMPLOYEE)
router.patch(
  "/:id/restore",
  protect,
  authorize("owner", "employee"),
  restoreListing
);


// 🔷 PUBLIC
router.get("/", getListings);
router.get("/:id", getListingById);


// 🔷 EDIT (EMPLOYEE ONLY)
router.put(
  "/:id",
  protect,
  authorize("employee"),
  upload.array("images", 5),
  updateListing
);


module.exports = router;