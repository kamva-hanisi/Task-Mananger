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
    <div>
      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <span>
            {task.title} {task.completed ? "✔" : ""}
          </span>

          <div>
            <button onClick={() => toggleTask(task.id, task.completed)}>
              Toggle
            </button>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
