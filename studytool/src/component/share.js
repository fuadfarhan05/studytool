import React from "react";
import { PiCopySimpleThin } from "react-icons/pi";
import { HiClipboardCopy } from "react-icons/hi";
import { PiCheckThin } from "react-icons/pi";




function Share({ roomCode, onClose }) {
    const [copied, setCopied] = React.useState(false);

    const fullTextToCopy = `https://lenseforlearning.vercel.app\nRoom Code:\n${roomCode}`;


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
            <p>https://lenseforlearning.vercel.app</p>
            <p>Room Code:</p>
        <p style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>{roomCode}</p>
        <button
          onClick={handleCopy}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            background: "#8bfcb6",
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
