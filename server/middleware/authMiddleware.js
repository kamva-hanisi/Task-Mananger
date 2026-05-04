const { verifyToken } = require("../utils/token");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: "Please sign in first" });
  }

  req.user = user;
  next();
};
