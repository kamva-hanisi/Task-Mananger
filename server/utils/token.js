const jwt = require("jsonwebtoken");

const getSecret = () => process.env.AUTH_SECRET || "change-this-secret";

exports.createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, getSecret(), {
    expiresIn: "1d",
  });
};

exports.verifyToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, getSecret());
  } catch (err) {
    return null;
  }
};
