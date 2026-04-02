import { useState } from "react";
import API from "../services/api";

function TaskForm({ fetchTasks, setError }) {
  const [title, setTitle] = useState("");

  const addTask = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      await API.post("/tasks", { title: title.trim() });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Unable to add task. Please try again.");
    }
  };

  return (
    <form className="task-form" onSubmit={addTask}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
