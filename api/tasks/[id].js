const taskController = require("../../server/controllers/taskController");
const authMiddleware = require("../../server/middleware/authMiddleware");
const { allowMethods, runAuth } = require("../_utils/http");

module.exports = async (req, res) => {
  if (!allowMethods(req, res, ["PUT", "DELETE"])) {
    return;
  }

  const isAuthorized = await runAuth(req, res, authMiddleware);

  if (!isAuthorized) {
    return;
  }

  req.params = {
    id: req.query.id,
  };

  if (req.method === "PUT") {
    return taskController.updateTask(req, res);
  }

  return taskController.deleteTask(req, res);
};
