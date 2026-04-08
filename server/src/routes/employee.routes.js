const express = require("express");
const router = express.Router();
const { getLeads } = require("../controllers/employee.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Only employee can access
router.get("/leads", protect, authorize("employee"), getLeads);
router.post("/employee/create", protect, authorize("owner"), createEmployee);

router.post("/employee/login", employeeLogin);

module.exports = router;