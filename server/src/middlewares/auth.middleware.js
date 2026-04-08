const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let entity;

    if (decoded.type === "employee") {
      entity = await Employee.findById(decoded.id);
      req.userType = "employee"; // 🔥 IMPORTANT
    } else {
      entity = await User.findById(decoded.id);
      req.userType = "user"; // 🔥 IMPORTANT
    }

    if (!entity) {
      return res.status(401).json({ message: "Not found" });
    }

    req.user = entity;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// 🔐 AUTHORIZE (YOU WERE MISSING THIS DEFINITION)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied: role missing",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

// ✅ EXPORT BOTH
module.exports = {
  protect,
  authorize,
};


// const jwt = require("jsonwebtoken");




// module.exports = { protect };