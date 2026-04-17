import { useState } from "react";
import API from "../services/api";

function TaskList({ tasks, fetchTasks, setError }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const toggleTask = async (task) => {
    setError("");

    try {
      await API.put(`/tasks/${task.id}`, {
        title: task.title,
        completed: !task.completed,
      });

      fetchTasks();
    } catch (err) {
      setError("Unable to update task.");
    }
  };

  const deleteTask = async (id) => {
    setError("");

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Unable to delete task.");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (task) => {
    setError("");

    const payload = {
      title: editTitle.trim(),
      completed: Boolean(task.completed),
    };

    try {
      await API.put(`/tasks/${task.id}`, {
        title: editTitle.trim(),
        completed: task.completed,
      });

      setEditingId(null);
      setEditTitle("");
      fetchTasks();
    } catch (err) {
      console.log("EDIT ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Unable to edit task.");
    }
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task" key={task.id}>
          {editingId === task.id ? (
            <input
              className="edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
          ) : (
            <span
              className={task.completed ? "task-title completed" : "task-title"}
            >
              {task.title}
            </span>
          )}

          <div className="task-actions">
            <button onClick={() => toggleTask(task)}>
              {task.completed ? "Undo" : "Complete"}
            </button>

            {editingId === task.id ? (
              <>
                <button className="save-btn" onClick={() => saveEdit(task)}>
                  Save
                </button>
                <button className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => startEdit(task)}>
                Edit
              </button>
            )}

            <button className="danger" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
