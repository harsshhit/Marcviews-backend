const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - Authentication middleware
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2) Check if token exists
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // 3) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Grant access to protected route
    req.user = user;
    // Add id property for consistency
    req.user.id = req.user._id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token. Please log in again." });
  }
};
