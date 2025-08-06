import React, { useState } from "react";
import "../App.css";


function CreateCards() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cards, setCards] = useState([]);

  const handleAddCard = () => {
    if (front.trim() && back.trim()) {
      setCards([...cards, { front, back }]);
      setFront("");
      setBack("");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 24 }}>
      <h2>Lense Studio</h2>
      <h3>Welcome to Lense Studio! In here you can create your own Flashcards deck to study AND share your flashcards deck to the community page for others to use for practice.</h3>
      <input
        type="text"
        placeholder="Front"
        value={front}
        onChange={e => setFront(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 6 }}
      />
      <input
        type="text"
        placeholder="Back"
        value={back}
        onChange={e => setBack(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8, borderRadius: 6 }}
      />
      <button onClick={handleAddCard} style={{ width: "100%", padding: 10, borderRadius: 6, background: "#8bfcb6", color: "#222429", fontWeight: "bold" }}>
        Add Card
      </button>
      <ul style={{ marginTop: 16 }}>
        {cards.map((card, idx) => (
          <li key={idx} style={{ background: "#23272f", color: "#fff", borderRadius: 6, padding: 10, marginBottom: 8 }}>
            <strong>Front:</strong> {card.front} <br />
            <strong>Back:</strong> {card.back}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateCards;