const authController = require("../../server/controllers/authController");
const { allowMethods } = require("../_utils/http");

module.exports = async (req, res) => {
  if (!allowMethods(req, res, ["POST"])) {
    return;
  }

  return authController.signIn(req, res);
};
