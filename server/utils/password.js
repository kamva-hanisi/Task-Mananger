const bcrypt = require("bcryptjs");

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.verifyPassword = (password, storedHash) => {
  return bcrypt.compareSync(password, storedHash);
};
