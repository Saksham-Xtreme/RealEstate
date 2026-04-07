const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
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



// // SIGNUP (password-based)
// exports.signup = async (req, res) => {
//   try {
//     const { email, password, phone, name } = req.body;

//     if (!phone || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone and password required",
//       });
//     }

//     const existing = await User.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       phone,
//       name,
//       password: hashedPassword, // stored even if not in schema
//     });

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ success: true, token, user });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;

//     const user = await User.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (!user || !user.password) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     user.lastLogin = new Date();
//     await user.save();

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ success: true, token, user });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// };

// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/user.model");

// ─── SIGNUP ─────────────────
exports.signup = async (req, res) => {
  try {
    const { email, password, phone, name } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      phone,
      name,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, user });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
  
    res.status(500).json({
      success: false,
      message: err.message,   // 🔥 add this
    });
  }
};



exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log("LOGIN INPUT (phone):", phone);

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password required",
      });
    }

    const user = await User.findOne({ phone });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password not set for this user",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // optional: update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};