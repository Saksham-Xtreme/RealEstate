const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const {
  sendOtpService,
  verifyOtpService
} = require("../services/otp.service");

// 📲 SEND OTP
exports.sendOtp = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Request body missing" });
      }
  
      const { phone } = req.body;
      
  
      if (!phone) {
        return res.status(400).json({ error: "Phone is required" });
      }
  
      await sendOtpService(phone);
  
      res.json({ message: "OTP sent" });
  
    } catch (err) {
      console.log("❌ SEND OTP ERROR:", err.response?.data || err.message);
  
      res.status(500).json({
        error: err.response?.data || err.message
      });
    }

    console.log("BODY:", req.body);
};
// 🔐 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const result = await verifyOtpService(phone, otp);

    if (result.data?.verificationStatus !== "VERIFICATION_COMPLETED") {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "OTP verified",
      token,
      user
    });

  } catch (err) {
    console.log("❌ VERIFY OTP ERROR:", err.response?.data || err.message);

    res.status(400).json({
      error: err.response?.data || err.message
    });
  }
};