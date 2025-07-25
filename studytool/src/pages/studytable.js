import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import "../App.css";

function StudyTable() {
  const [rows, setRows] = useState([
    { subject: "", notes: "" }
  ]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { subject: "", notes: "" }]);
  };

  return (
    <div className="study-table" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Sidebar />
      <div className="table-card">
            <h2>Set Timer for</h2>
            <button>30 min</button>
            <button>1 hour</button>

        
        </div>
      </div>
  );
}

export default StudyTable;