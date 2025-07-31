// StudyTable.js
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
  const [members, setMembers] = useState([]);

  const timerRef = useRef(null);

  const memberColors = ["#58f895ff", "#39b7f7ff", "#faec5bff", "#e814baff"]; 

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
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
      if (!data) return;

      setMembers(data.members || []);

      if (data?.timer?.active) {
        const now = Date.now();
        const endTime = data.timer.startTime + data.timer.duration * 1000;
        const remaining = Math.floor((endTime - now) / 1000);

        if (remaining > 0) {
          startLocalTimer(remaining);
        } else {
          stopTimer(false);
        }
      } else {
        stopTimer(false);
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

      if (members.length >= 4 && !members.includes(user.uid)) {
        alert("This room is full (max 4 people).");
        return;
      }

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
            maxWidth: "300px",
            fontSize: "16px"
          }}
        />
        <div className="join-create-buttons" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: 10, gap: "10px" }}>
          <button onClick={handleJoinRoom}>Join Room</button>
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
      </div>

      <div className="table-card" style={{ margin: "40px auto", padding: "20px", maxWidth: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Circular Table */}
        <div style={{
          position: "relative",
          width: 300,
          height: 300,
          backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
          borderRadius: "50%",
          backgroundColor: "#6d4c0eff",
          borderColor: "#ede4d7ff",
          border: "5px solid #ccc",
          marginBottom: 40
        }}>
          {members.map((member, index) => {
            const angle = (index / members.length) * 2 * Math.PI;
            const radius = 120;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={member}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px - 25px)`,
                  top: `calc(50% + ${y}px - 25px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: memberColors[index % memberColors.length],
                    border: "3px solid #fff",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
                  }}
                />
                {member === getAuth().currentUser?.uid && (
                  <span style={{ fontSize: 12, fontWeight: 'bold', color: "#ffffffff", marginTop: 6 }}>You</span>
                )}
              </div>
            );
          })}
        </div>

        <h2>Set Timer for</h2>
        <button className="button1" onClick={() => startTimer(60)}>1 hour</button>
        <button className="button2" onClick={() => startTimer(120)}>2 hours</button>

        <div style={{ margin: "20px 0", fontSize: 40, fontWeight: "bold", color: "#000000ff", background: "#acf5c9ff", padding: "20px", borderRadius: "10px" }}>
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
      </div>
    </div>
  );
}

export default StudyTable;
