import { useEffect, useState } from "react";
import API from "./services/api";
import AuthPage from "./components/AuthPage";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.scss";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("task_manager_user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      localStorage.removeItem("task_manager_user");
      localStorage.removeItem("task_manager_token");
      return null;
    }
  });
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
      if (err.response?.status === 401) {
        localStorage.removeItem("task_manager_token");
        localStorage.removeItem("task_manager_user");
        setUser(null);
        setTasks([]);
        setError("");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load tasks. Make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("task_manager_token");
    localStorage.removeItem("task_manager_user");
    setUser(null);
    setTasks([]);
    setError("");
  };

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <h1>Task Manager</h1>
          <p>{user.name}</p>
          <span className="app-description">
            Add tasks, mark them complete, and keep your day organized.
          </span>
        </div>
        <button type="button" className="ghost-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>
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
