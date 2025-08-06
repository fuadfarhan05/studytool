import React from "react";
import "../App.css";
import { useNavigate } from 'react-router-dom';
import { PiPlusBold, PiMagnifyingGlassBold } from "react-icons/pi";
import Sidebar from "../component/sidebar";

function Flashcard() {
  const navigate = useNavigate();

  const goCreate = () => {
    navigate("/createcards");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Sidebar />
      <h2>Lense Community Page</h2>

      <div
        style={{
          maxWidth: 500,
          width: "100%",
          margin: "auto",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Search Row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <input
            type="text"
            placeholder="Search flashcards"
            style={{
              flex: 1,
              minWidth: "60%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          />
          <button
            style={{
              padding: "10px 16px",
              fontSize: 20,
              borderRadius: 8,
              border: "none",
              background: "#8bf3cfff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <PiMagnifyingGlassBold />
          </button>
          <button
            onClick={goCreate}
            style={{
              padding: "10px 16px",
              fontSize: 20,
              borderRadius: 8,
              border: "none",
              background: "#16dda2ff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flexGrow: 1,
            }}
          >
            Create <PiPlusBold />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
