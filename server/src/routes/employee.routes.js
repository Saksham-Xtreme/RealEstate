const express = require("express");
const router = express.Router();
const { getLeads } = require("../controllers/employee.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Only employee can access
router.get("/leads", protect, authorize("employee"), getLeads);

module.exports = router;