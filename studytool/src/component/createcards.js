import React, { useState } from "react";
import "../App.css";
import StudioSidebar from "./studiosidebar";

function CreateCards() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [subject, setSubject] = useState("Math");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleAddCard = () => {
    if (front.trim() && back.trim()) {
      setCards([...cards, { front, back }]);
      setFront("");
      setBack("");
      setCurrentCardIndex(cards.length);
    }
  };

  const handleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) =>
      prev < cards.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "auto",
      padding: "24px 16px",
       overflowX: "hidden", 
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      minHeight: "100vh",
    }}>

      <h2 style={{ textAlign: "center" }}>Lense Studio</h2>
      <p style={{ textAlign: "center" }}>
        Welcome to Lense Studio! Here you can create your own Flashcards deck
        to study and share with the community!
      </p>

      <h3>Select a subject category:</h3>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 10,
          fontWeight: "bold",
          background: "#b5f0cbff",
          color: "#222429",
        }}
      >
        <option value="Math">Math</option>
        <option value="Language">Language</option>
        <option value="Sight Worlds">Sight Words</option>
        <option value="General Vocab">General Vocab</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="text"
        placeholder="Front"
        value={front}
        onChange={(e) => setFront(e.target.value)}
        style={{
          width: "90%",
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ccc",
        }}
      />
      <input
        type="text"
        placeholder="Back"
        value={back}
        onChange={(e) => setBack(e.target.value)}
        style={{
          width: "90%",
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleAddCard}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 25,
          background: "#5dd48bff",
          color: "#222429",
          fontWeight: "bold",
          border: "none",
          marginTop: 10,
          cursor: "pointer"
        }}
      >
        Add Card
      </button>

      <div style={{ marginTop: 30 }}>
        <h3>Your Cards</h3>
        {cards.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              className="flip-card"
              style={{
                width: "90%",
                height: "200px",
                perspective: "1000px",
                position: "relative",
              }}
              onClick={() => handleFlip(currentCardIndex)}
            >
              <div
                className={`flip-card-inner ${
                  flippedCards[currentCardIndex] ? "flipped" : ""
                }`}
              >
                <div className="flip-card-front">
                  {cards[currentCardIndex].front}
                </div>
                <div className="flip-card-back">
                  {cards[currentCardIndex].back}
                </div>
              </div>
            </div>
            

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={handlePrev}
                disabled={currentCardIndex === 0}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontWeight: "bold",
                  background: "#b5f0cbff",
                  color: "#222429",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 40
                }}
              >
                ◀ Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentCardIndex === cards.length - 1}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  fontWeight: "bold",
                  background: "#b5f0cbff",
                  color: "#222429",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 40
                }}
              >
                Next ▶
              </button>
            </div>
          </div>
        ) : (
          <p style={{ marginTop: 20, textAlign: "center" }}>No cards yet.</p>
        )}
      </div>
      <StudioSidebar />
    </div>
  );
}

export default CreateCards;
