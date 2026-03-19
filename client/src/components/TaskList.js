import API from "../services/api";

function TaskList({ tasks, fetchTasks }) {
  const toggleTask = async (id, completed) => {
    await API.put(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
            }}
            onClick={() => toggleTask(task.id, task.completed)}
          >
            {task.title}
          </span>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
