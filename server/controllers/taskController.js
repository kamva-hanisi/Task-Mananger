const db = require("../config/db");

exports.getTasks = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, completed, created_at FROM tasks WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.addTask = async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO tasks (user_id, title, completed)
       VALUES ($1, $2, $3)
       RETURNING id, title, completed, created_at`,
      [req.user.id, title.trim(), false],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add task:", err);
    return res.status(500).json({ message: "Failed to add task" });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const currentResult = await db.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.id],
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const current = currentResult.rows[0];
    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedCompleted =
      completed !== undefined ? completed : current.completed;

    const result = await db.query(
      `UPDATE tasks
       SET title = $1, completed = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, title, completed, created_at`,
      [updatedTitle, updatedCompleted, id, req.user.id],
    );

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update task:", err);
    return res.status(500).json({ message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Failed to delete task:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
