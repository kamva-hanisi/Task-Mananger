import { useEffect, useState } from "react";
import API from "./services/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Unable to load tasks. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <TaskForm fetchTasks={fetchTasks} setError={setError} />
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList tasks={tasks} fetchTasks={fetchTasks} setError={setError} />
      )}
    </div>
  );
}

export default App;
