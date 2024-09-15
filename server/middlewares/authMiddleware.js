// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "7f81798c58db2a591185ef8b098fae196fb791454237a2a370f7f938450f3ed2";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
