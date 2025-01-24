const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const tokenWithoutBearer = token.split(" ")[1];

  if (!tokenWithoutBearer) {
    return res.status(401).json({ message: "Access Denied: Invalid Token Format" });
  }

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};


// middle ware to get user details
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization header missing or incorrectly formatted" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Authentication failed", error: err.message });
  }
};



module.exports = authenticate,auth;
