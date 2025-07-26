import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../component/sidebar";
import "../App.css";

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/auth";
import { getAuth } from "firebase/auth";

function StudyTable() {
  const [roomCode, setRoomCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const timerRef = useRef(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const attachRoomListener = (code) => {
    const roomRef = doc(db, "rooms", code);
    onSnapshot(roomRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.timer?.active) {
        const now = Date.now();
        const endTime = data.timer.startTime + data.timer.duration * 1000;
        const remaining = Math.floor((endTime - now) / 1000);

        if (remaining > 0) {
          startLocalTimer(remaining);
        } else {
          stopTimer(false); // don't write to Firebase if it ended naturally
        }
      } else {
        stopTimer(false); // sync stop across clients
      }
    });
  };

  const handleCreateRoom = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const code = generateRoomCode();

    try {
      await setDoc(doc(db, "rooms", code), {
        createdBy: user.uid,
        members: [user.uid],
        createdAt: new Date().toISOString(),
      });

      alert(`Room created with code: ${code}`);
      setRoomCode(code);
      setCurrentRoom(code);
      attachRoomListener(code);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room: " + error.message);
    }
  };

  const handleJoinRoom = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const code = roomCode.toUpperCase().trim();
    if (!code) {
      alert("Please enter a room code.");
      return;
    }

    const roomRef = doc(db, "rooms", code);

    try {
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Room not found.");
        return;
      }

      const roomData = roomSnap.data();
      const members = roomData.members || [];

      if (!members.includes(user.uid)) {
        members.push(user.uid);
        await setDoc(roomRef, { ...roomData, members }, { merge: true });
      }

      alert(`Joined room: ${code}`);
      setCurrentRoom(code);
      attachRoomListener(code);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room: " + error.message);
    }
  };

  const startLocalTimer = (duration) => {
    clearInterval(timerRef.current);
    setTimer(duration);
    setTimerActive(true);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startTimer = async (minutes) => {
    const duration = minutes * 60;
    const startTime = Date.now();

    startLocalTimer(duration);

    if (currentRoom) {
      const roomRef = doc(db, "rooms", currentRoom);
      await setDoc(
        roomRef,
        {
          timer: {
            startTime: startTime,
            duration: duration,
            active: true,
          },
        },
        { merge: true }
      );
    }
  };

  const stopTimer = async (updateFirestore = true) => {
    clearInterval(timerRef.current);
    setTimerActive(false);

    if (updateFirestore && currentRoom) {
      const roomRef = doc(db, "rooms", currentRoom);
      await setDoc(
        roomRef,
        {
          timer: {
            active: false,
          },
        },
        { merge: true }
      );
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="study-table" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Sidebar />

      <div className="table-card">
        <h2>Set Timer for</h2>
        <button className="button1" onClick={() => startTimer(60)}>1 hour</button>
        <button className="button2" onClick={() => startTimer(120)}>2 hours</button>

        <div style={{ margin: "20px 0", fontSize: 32, fontWeight: "bold", color: "#8bfcb6" }}>
          {timer > 0 ? formatTime(timer) : "00:00"}
        </div>

        {timerActive && (
          <button
            onClick={() => stopTimer()}
            style={{
              marginBottom: "15px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#ff6b6b",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Stop Timer
          </button>
        )}

        <div style={{ marginTop: 30, width: "100%", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1.5px solid #8bfcb6",
              marginRight: "10px",
              width: "60%",
              fontSize: "16px"
            }}
          />
          <button 
            onClick={handleJoinRoom}
            style={{
              marginTop: "10px",
              marginLeft: "10px",
              padding: "10px 18px",
              borderRadius: "8px",
              background: "#8bfcb6",
              color: "#222429",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Join Room
          </button>
          <button
            onClick={handleCreateRoom}
            style={{
              marginTop: "10px",
              marginLeft: "10px",
              padding: "10px 18px",
              borderRadius: "8px",
              background: "#00d9f5",
              color: "#222429",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudyTable;
