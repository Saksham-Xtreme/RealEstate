const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  signup,   // ✅ add this
  login     // ✅ add this
} = require("../controllers/auth.controller");

// OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Password auth routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;