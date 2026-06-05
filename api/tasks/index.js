const taskController = require("../../server/controllers/taskController");
const authMiddleware = require("../../server/middleware/authMiddleware");
const { allowMethods, runAuth } = require("../_utils/http");

module.exports = async (req, res) => {
  if (!allowMethods(req, res, ["GET", "POST"])) {
    return;
  }

  const isAuthorized = await runAuth(req, res, authMiddleware);

  if (!isAuthorized) {
    return;
  }

  if (req.method === "GET") {
    return taskController.getTasks(req, res);
  }

  return taskController.addTask(req, res);
};
