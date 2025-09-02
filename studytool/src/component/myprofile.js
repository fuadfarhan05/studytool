import React, { useState, useEffect } from "react";
import { PiXCircleBold } from "react-icons/pi";
import { db } from "../firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

function MyProfile({ user, roomCode, onClose }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !roomCode) return; 

    const fetchNote = async () => {
      try {
        const docRef = doc(db, "rooms", roomCode, "notes", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNote(docSnap.data().note || "");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [user, roomCode]);

  const handleSave = async () => {
    if (!user || !roomCode) return;

    try {
      await setDoc(
        doc(db, "rooms", roomCode, "notes", user.uid),
        {
          note: note,
          user: user.displayName || "Lens User",
          uid: user.uid,
        },
        { merge: true }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  if (!user) return null; // render nothing if no user

  return (
    <div className="profile-modal">
      <h2>
        <strong>{user.displayName || "Lens User"}</strong>
      </h2>
      <p style = {{
        textAlign: "center", 
        color: "#000000ff",
      }}
      >You can put notes here that the users at your study table will see</p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your notes here..."
        className="notes-input"
      />

      <button className="save-button" onClick={handleSave}>
        Save
      </button>

      {saved && <p style={{ color: "green", marginTop: 10 }}>Saved info!</p>}

      <button className="close-button" onClick={onClose}>
        <PiXCircleBold />
      </button>
    </div>
  );
}

export default MyProfile;
