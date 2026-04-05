const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // 🔷 Extract token safely
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔷 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔷 Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token"
    });
  }
};

module.exports = protect;