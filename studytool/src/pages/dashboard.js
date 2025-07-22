import React, { useEffect, useState } from "react";
import { getAuth } from "../firebase/auth";

function Dashboard() {
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(60); // Example progress value (out of 100)
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName || "User");
    } else {
      setName("Guest");
    }
  }, []);

  const handleAddTask = () => {
    const task = taskInput.trim();
    if (task) {
      setTasks([...tasks, task]);
      setTaskInput("");
    }
  };

  return (
    <div className="dashboard" style={{ padding: 20 }}>
      <header>
        <div className="dashboard-header">
          <h3 className="left">Welcome, {name}</h3>
          <div className="dashboard-card">
            <h2>Your Progress:</h2>
            <div style={{ background: "#eee", borderRadius: 8, height: 24, width: "90%", marginBottom: 20, marginLeft: 10 }}>
              <div
                style={{
                  width: `${progress}%`,
                  background: "#8bfcb6",
                  height: "100%",
                  borderRadius: 8,
                  borderWidth: 10,
                  borderColor: "#b4d865ff",
                  transition: "width 0.5s"
                }}
              />
            </div>
          </div>
          <div className="to-do-list">
            <h3>Pending Tasks</h3>
            <input
              type="text"
              placeholder="Add a new task..."
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddTask(); }}
            />
            <button onClick={handleAddTask}>Add</button>
            <ul>
              {tasks.map((task, idx) => (
                <li key={idx} className="task-list">{task}</li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;