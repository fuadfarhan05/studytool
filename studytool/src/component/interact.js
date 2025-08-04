import React, { useState } from "react";
import "../App.css";
import { PiMoonThin, PiCheckCircleThin, PiHamburgerThin, PiHeartThin, PiNotEquals } from "react-icons/pi";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/auth";


const options = [
  { label: "Sleeping", icon: <PiMoonThin size={28} /> },
  { label: "Locked In", icon: <PiCheckCircleThin size={28} /> },
  { label: "Eating", icon: <PiHamburgerThin size={28} /> },
  { label: "Spreading Love", icon: <PiHeartThin size={28} /> },
  { label: "", icon: <PiNotEquals size={28} /> },
];

const auth = getAuth();

function Interact({roomCode, onClose, onSelectEmote }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = async (index) => {
        setSelected(index);
        const emote = options[index];
        onSelectEmote(emote);
        onClose();

        const user = auth.currentUser;

        if (!user || !roomCode) return;

        const roomRef = doc(db, "rooms", roomCode);
        const roomSnap = await getDoc(roomRef);
        if (!roomSnap.exists()) return;

        const roomData = roomSnap.data();
        const updatedMembers = (roomData.members || []).map((m) =>
            m.uid === user.uid ? { ...m, status: emote.label } : m
        );

        await setDoc(roomRef, { members: updatedMembers }, { merge: true });
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
