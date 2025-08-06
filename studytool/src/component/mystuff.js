import React from "react";
import "../App.css";
import StudioSidebar from "./studiosidebar";

function MyStuff() {
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 24 }}>
        <StudioSidebar />
      <h2>My Stuff</h2>
      <p>Your uploaded and created flashcards will be saved here</p>

      <p>scroll through to see all your creations!</p>



    </div>
  );
}

export default MyStuff;