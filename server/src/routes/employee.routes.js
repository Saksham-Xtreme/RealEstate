const express = require("express");
const router = express.Router();
const {
    createEmployee,
    employeeLogin,
    getLeads
} = require("../controllers/employee.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Only employee can access
router.get("/leads", protect, authorize("employee"), getLeads);
router.post("/create", protect, authorize("owner"), createEmployee);
router.post("/login", employeeLogin);

module.exports = router;