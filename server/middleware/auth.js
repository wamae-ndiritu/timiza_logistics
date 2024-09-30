const jwt = require("jsonwebtoken");
const User = require("../models/User");

function verify(req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object from token payload to request object
    req.user = decoded
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied! You must be an admin" });
    }

    // Attach user object from token payload to request object
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = { verify, isAdmin };
