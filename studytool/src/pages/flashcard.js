import React from "react";
import "../App.css";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { PiPlusBold, PiMagnifyingGlassBold } from "react-icons/pi";
import Sidebar from "../component/sidebar";
import CreateCards from "../component/createcards";

function Flashcard() {
  const navigate = useNavigate();


  const goCreate = () => {
    navigate("/createcards");
  };
  return (
    <div>
    <Sidebar />

    
          <div style={{ maxWidth: 400, margin: "auto", padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh" }}>
          {/* Search Row */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="search for flashcards"
              style={{
                flex: 1,
                padding: 10,
                fontSize: 16,
                border: "1px solid #ccc",
                borderRadius: 4
              }}
            />
            <button style={{ padding: "10px 16px", fontSize: 25, cursor: "pointer" }}>
               <PiMagnifyingGlassBold />
            </button>
             <div>
            <button onClick={goCreate} style={{ padding: "10px 16px", fontSize: 25, cursor: "pointer" }}>
              Create <PiPlusBold />
            </button>
          </div>
          </div>

         
        </div>
        </div>
  );
}

export default Flashcard;