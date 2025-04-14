import { useState, useEffect } from "react";
import API from "../Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../Components/Header";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sortMethod, setSortMethod] = useState("added");

  // Carica le task all'avvio
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Errore nel caricamento delle task", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/tasks", { title: newTask });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error("Errore nell'aggiunta della task", err);
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      // Inverte lo stato attuale
      const updatedStatus = !task.completed;
      const res = await API.patch(`/tasks/${task._id}/complete`, {
        completed: updatedStatus,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Errore nel toggling della task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Errore nella cancellazione", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const completedTaskCount = tasks.filter((task) => task.completed).length;

  const sortedTasks =
    sortMethod === "alphabetical"
      ? [...tasks].sort((a, b) => a.title.localeCompare(b.title))
      : tasks;

  return (
    <>
      <Header />
      <div className="task-page">
        <header className="header">
          <h1>Gestione Task - Task completate: {completedTaskCount}</h1>
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
          >
            <option value="added">Filtra per ordine di aggiunta</option>
            <option value="alphabetical">Filtra in ordine alfabetico</option>
          </select>
          <button onClick={handleLogout}>Logout</button>
        </header>
        <section>
          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="Aggiungi una nuova task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              required
            />
            <button type="submit">Aggiungi</button>
          </form>
        </section>
        <section>
          <ul>
            {sortedTasks.map((task) => (
              <li
                key={task._id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <span
                  className="tasketta"
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleTaskCompletion(task)}
                >
                  {task.title}
                </span>
                <button onClick={() => deleteTask(task._id)}>
                  Cancella Task
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default TaskPage;
