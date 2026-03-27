const db = require("../config/db");

exports.getTasks = (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Failed to fetch tasks:", err);
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }

    return res.json(results);
  });
};

exports.addTask = (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  db.query(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title.trim(), false],
    (err, result) => {
      if (err) {
        console.error("Failed to add task:", err);
        return res.status(500).json({ message: "Failed to add task" });
      }

      return res.status(201).json({
        id: result.insertId,
        title: title.trim(),
        completed: false,
      });
    },
  );
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "completed must be provided as a boolean" });
  }

  db.query(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, id],
    (err, result) => {
      if (err) {
        console.error("Failed to update task:", err);
        return res.status(500).json({ message: "Failed to update task" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.json({ id: Number(id), completed });
    },
  );
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Failed to delete task:", err);
      return res.status(500).json({ message: "Failed to delete task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  });
};
