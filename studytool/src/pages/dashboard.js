import React, { useEffect, useState } from "react";
import { getAuth } from "../firebase/auth";

function Dashboard() {
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(60); // Example progress value (out of 100)

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName || "User");
    } else {
      setName("Guest");
    }
  }, []);

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
            <h3>To-Do List</h3>
                <input type="text" placeholder="Add a new task..." />
                <button>Add</button>
            

            </div>
        </div>
      </header>
    </div>
  );
}

export default Dashboard;