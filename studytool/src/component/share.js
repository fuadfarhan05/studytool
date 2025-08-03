import React from "react";
import { PiCopySimpleThin } from "react-icons/pi";
import { HiClipboardCopy } from "react-icons/hi";
import { PiCheckThin } from "react-icons/pi";




function Share({ roomCode, onClose }) {
    const [copied, setCopied] = React.useState(false);

    const messages = [
        "Let's get productive together — join my study room!",
        "Need some focus time? Hop onto my study session!",
        "Come vibe and study with me",
        "Join me in this study room — we’ve got goals to crush!",
        "Let’s stay accountable — jump into my study room!",
        "Grab your coffee and notes — join my study session!",
        "Let’s power through homework together in this room!",
        "I’m studying right now — come join and stay focused!",
        "Join my virtual study table — let’s knock out this to-do list!",
        "Let’s lock in for a study session — I’ll see you in the room!"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];


    const fullTextToCopy = `https://lenseforlearning.vercel.app\n${randomMessage}\nRoom Code:\n${roomCode}`;


    const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullTextToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    } catch (err) {
      alert("Failed to copy code.");
    }
  };
  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <div className="content-for-share">
        <h2>Share your study room with your friends</h2>
            <p>Room Code:</p>
        <p style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>{roomCode}</p>
        <button
          onClick={handleCopy}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            background: copied ? "#54916bff" : "#ddf9e1ff",
            border: "none",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          {copied ? "Copied" : "Copy"}
          {copied ? <PiCheckThin/> : <PiCopySimpleThin/>}
        </button>
        </div>
       
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Share;
