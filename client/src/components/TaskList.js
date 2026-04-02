import API from "../services/api";

function TaskList({ tasks, fetchTasks, setError }) {
  const toggleTask = async (id, completed) => {
    setError("");

    try {
      await API.put(`/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (err) {
      setError("Unable to update task. Please try again.");
    }
  };

  const deleteTask = async (id) => {
    setError("");

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Unable to delete task. Please try again.");
    }
  };

  if (!tasks.length) {
    return (
      <div className="empty-state">No tasks yet. Add one to get started.</div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <span
            className={task.completed ? "task-title completed" : "task-title"}
          >
            {task.title}
          </span>

          <div className="task-actions">
            <button onClick={() => toggleTask(task.id, task.completed)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
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
