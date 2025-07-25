import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase/auth";
import {
  collection, getDocs, addDoc, onSnapshot,
  updateDoc, doc, deleteDoc
} from "firebase/firestore";

function Dashboard() {
  const [name, setName] = useState("User");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setName(user.displayName || "User");
      const q = collection(db, "users", user.uid, "tasks");
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updated = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(updated);
        updateProgress(updated);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const updateProgress = (list) => {
    const total = list.length;
    const completed = list.filter(t => t.completed).length;
    setProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
  };

  const handleAddTask = async () => {
    const text = taskInput.trim();
    if (text && user) {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        text,
        completed: false,
      });
      setTaskInput("");
    }
  };

  const toggleTaskCompletion = async (taskId, current) => {
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, { completed: !current });
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  const clearAllTasks = async () => {
  if (!user) return;

  try {
    const q = collection(db, "users", user.uid, "tasks");
    const snapshot = await getDocs(q);

    const deletions = snapshot.docs.map(docSnap =>
      deleteDoc(doc(db, "users", user.uid, "tasks", docSnap.id))
    );

    await Promise.all(deletions);
    console.log("All tasks cleared.");
  } catch (err) {
    console.error("Error clearing tasks:", err);
  }
};;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <header className="App-header">
        <h3>Welcome, {name}</h3>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </header>

      <div className="dashboard-card">
        <h2>Your Progress:</h2>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="task-list">
        <h3>You are studying...</h3>
        <ul>
          <AnimatePresence>
            {tasks.filter(task => !task.completed).map((task) => (
              <motion.li
                key={task.id}
                className="task-list"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleTaskCompletion(task.id, task.completed)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  deleteTask(task.id);
                }}
              >
                {task.text}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="input-footer">
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        <button onClick={handleAddTask}>Add</button>
        <button onClick={clearAllTasks}>Reset Progress</button>
      </div>


    </div>
  );
}

export default Dashboard;
