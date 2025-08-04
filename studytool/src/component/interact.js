import React, { useState } from "react";
import "../App.css";
import { PiMoonThin, PiCheckCircleThin, PiHamburgerThin, PiHeartThin } from "react-icons/pi";

const options = [
  { label: "Sleeping", icon: <PiMoonThin size={28} /> },
  { label: "Locked In", icon: <PiCheckCircleThin size={28} /> },
  { label: "Eating", icon: <PiHamburgerThin size={28} /> },
  { label: "Spreading Love", icon: <PiHeartThin size={28} /> },
];

function Interact({ onClose, onSelectEmote }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(index);
    onSelectEmote(options[index]);
    onClose(); // close after selection
  };

  return (
    <div className="share-modal">
      <h2>Select Your Emote</h2>
      <div className="emote-wheel">
        {options.map((opt, index) => {
          const angle = (360 / options.length) * index;
          return (
            <div
              key={index}
              className={`emote-option ${selected === index ? "selected" : ""}`}
              style={{
                transform: `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`
              }}
              onClick={() => handleSelect(index)}
            >
              {opt.icon}
            </div>
          );
        })}
        <div className="emote-center">
          {selected !== null ? options[selected].label : "select"}
        </div>
      </div>

      <button className="close-button" onClick={onClose}>Close</button>
    </div>
  );
}


export default Interact;
