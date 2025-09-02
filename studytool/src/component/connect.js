import React, { useEffect, useState, useRef } from "react";
import { PiXCircleBold } from "react-icons/pi";
import { db } from "../firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import "../App.css";

const CARD_COLORS = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#FF6FCF"];

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

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) prevNote();
    else if (deltaX < -50) nextNote();
    touchStartX.current = null;
  };

  if (!user) return null;

  return (
    <div className="profile-modal">
      <button className="close-button" onClick={onClose}>
        <PiXCircleBold />
      </button>

      {notes.length > 0 ? (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            backgroundColor: CARD_COLORS[currentIndex % CARD_COLORS.length],
            borderRadius: "20px",
            border: "2px solid",
            padding: "20px",
            textAlign: "center",
            color: "#000000ff",
            marginTop: "20px",
            minHeight: "340px",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          <h3
          style={{
            color: "#000000ff",
          }}
          
          >{notes[currentIndex].user}</h3>
          <p>{notes[currentIndex].note}</p>
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
