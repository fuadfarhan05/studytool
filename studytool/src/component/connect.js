import React, { useEffect, useState, useRef } from "react";
import { PiXCircleBold } from "react-icons/pi";
import { db } from "../firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import "../App.css";

const CARD_COLORS = ["#a1f9c0ff", "#97c0faff", "#f4e197ff", "#f69bd8ff"];

function Connect({ user, roomCode, onClose }) {
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (!roomCode) return;

    const unsub = onSnapshot(collection(db, "rooms", roomCode, "notes"), (snap) => {
      const fetched = snap.docs.map((doc) => doc.data());
      setNotes(fetched);
    });

    return () => unsub();
  }, [roomCode]);

  const nextNote = () =>
    setCurrentIndex((prev) => (prev + 1) % notes.length);
  const prevNote = () =>
    setCurrentIndex((prev) => (prev - 1 + notes.length) % notes.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const firstName = (user.displayName || "User").split(" ")[0];

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) prevNote();
    else if (deltaX < -50) nextNote();
    touchStartX.current = null;
  };

  if (!user) return null;

  return (
    <div className="connect-modal">
      <button className="close-button" onClick={onClose}>
        <PiXCircleBold />
      </button>

      {notes.length > 0 ? (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            backgroundColor: CARD_COLORS[currentIndex % CARD_COLORS.length], // add transparency (80 hex = ~50%)
            borderRadius: "20px",
            border: "2px solid rgba(255, 255, 255, 0.2)", // light semi-transparent border
            padding: "20px",
            textAlign: "center",
            color: CARD_COLORS[currentIndex % CARD_COLORS.length] + "80", // slightly darker text color
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "20px",
            minHeight: "340px",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
            backdropFilter: "blur(15px) saturate(180%)", // frosted / liquid glass effect
            WebkitBackdropFilter: "blur(15px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}

        >
         <h3 style={{ color: "#000000ff" }}>
          {notes[currentIndex].user
            ? notes[currentIndex].user.split(" ")[0]
            : "User"}
        </h3>
         <div className="share-box">
          <p>{notes[currentIndex].note}</p>
          </div>
          <div className="horizontal" style={{ margin: "10px" }}>
            <button className="swipe" onClick={prevNote}>previous</button>
            <button className="swipe" onClick={nextNote}>next</button>
          </div>
        </div>
      ) : (
        <p>No notes yet...</p>
      )}
    </div>
  );
}

export default Connect;
