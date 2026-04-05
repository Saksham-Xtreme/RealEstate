const express = require("express");
const router = express.Router();

const {
  viewListing,
  timeSpent,
  interact,
} = require("../controllers/activity.controller");

const auth = require("../middlewares/auth.middleware");

router.post("/view", auth, viewListing);
router.post("/time", auth, timeSpent);
router.post("/interact", auth, interact);

module.exports = router;