import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../component/sidebar";
import "../App.css";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { HiServer } from "react-icons/hi";
import Share from "../component/share";
import Interact from "../component/interact";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/auth";
import { getAuth } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import {
  PiMoonThin,
  PiCheckCircleThin,
  PiHamburgerThin,
  PiHeartThin,
  PiXCircleThin,
} from "react-icons/pi";

const options = [
  { label: "Sleeping", icon: <PiMoonThin size={28} /> },
  { label: "Locked In", icon: <PiCheckCircleThin size={28} /> },
  { label: "Eating", icon: <PiHamburgerThin size={28} /> },
  { label: "Spreading Love", icon: <PiHeartThin size={28} /> },
  { label: "", icon: <PiXCircleThin size={28} /> },
];

function StudyTable() {
  const [roomCode, setRoomCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInteract, setShowInteract] = useState(false);
  const [myEmote, setMyEmote] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

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
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const code = generateRoomCode();
    const firstName = (user.displayName || "User").split(" ")[0];

    try {
      await setDoc(doc(db, "rooms", code), {
        createdBy: user.uid,
        members: [{ uid: user.uid, name: firstName }],
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

  const handleLeaveRoom = async () => {
    if (!user || !currentRoom) return;

    const roomRef = doc(db, "rooms", currentRoom);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return;
    const roomData = roomSnap.data();
    let updatedMembers = (roomData.members || []).filter((m) => m.uid !== user.uid);

    if (updatedMembers.length === 0) {
      await deleteDoc(roomRef);
    } else {
      await setDoc(roomRef, { ...roomData, members: updatedMembers }, { merge: true });
    }

    setCurrentRoom(null);
    setMembers([]);
    setRoomCode("");
    stopTimer(false);
    alert("You left. Join another when you're ready!");
  };

  const handleJoinRoom = async () => {
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

      if (members.length >= 4 && !members.some((m) => m.uid === user.uid)) {
        alert("Sorry, this room is full.");
        return;
      }

      if (!members.some((m) => m.uid === user.uid)) {
        const firstName = (user.displayName || "User").split(" ")[0];
        members.push({ uid: user.uid, name: firstName });
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
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="study-table" style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Sidebar />
      <img className="lenseimg" alt="" src="Lenseshare.png"></img>
      <h2>Create a virtual study room and share with your friends!</h2>

      <div style={{ marginTop: 30, width: "100%", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="cool-input"
        />

        <div
          className="join-create-buttons"
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: 10, gap: "10px" }}
        >
          <button onClick={handleJoinRoom}>Join Room</button>
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
      </div>

      <div
        className="table-card"
        style={{
          margin: "40px auto",
          padding: "20px",
          maxWidth: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Circular Table */}
        <div
          style={{
            position: "relative",
            width: 200,
            height: 200,
            backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
            borderRadius: "50%",
            backgroundColor: "#2e2c2aff",
            borderColor: "#afa99dff",
            border: "5px solid #ccc",
            marginBottom: 40,
          }}
        >
          {members.map((member, index) => {
            const emoteObj = options.find((opt) => opt.label === member.status);

            const angle = (index / members.length) * 2 * Math.PI;
            const radius = 120;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={member.uid}
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
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  }}
                />

                {member.uid === user?.uid ? (
                  <>
                    {emoteObj && emoteObj.label !== "" && (
                    <div style={
                      {
                        position: "absolute",
                        bottom: "60px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        padding: "6px 10px",
                        fontSize: "10px",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
                        whiteSpace: "nowrap",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        marginBottom: "30px",
                        }
                        }>
                             {emoteObj.label} {emoteObj.icon}
                          </div>
                        )}
                    <span
                      style={{ fontSize: 12, fontWeight: "bold", color: "#12bee5ff", marginTop: 6 }}
                    >
                      You
                    </span>
                  </>
                ) : (
                  emoteObj && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "60px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        padding: "6px 10px",
                        fontSize: "10px",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
                        whiteSpace: "nowrap",
                        border: "1px solid rgba(255, 255, 255, 0.3)"
                      }}

                    >
                      {emoteObj.label} {emoteObj.icon}
                    </div>
                  )
                )}

                <span style={{ fontSize: 12, fontWeight: "bold", color: "#9ed6c4ff", marginTop: 6 }}>
                  {member.displayName || member.name || "Unknown"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="row" style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: "10px" }}>
          <button className="share-button" onClick={() => setShowShareModal(true)}>
            share <HiArrowTopRightOnSquare />
          </button>
          <button className="share-button" onClick={() => setShowInteract(true)}>
            set emote <HiServer />
          </button>
        </div>

        <button className="leave-button" onClick={handleLeaveRoom}>
          Leave Room
        </button>

        {showInteract && (
          <Interact
            roomCode={roomCode}
            onClose={() => setShowInteract(false)}
            onSelectEmote={(emote) => setMyEmote(emote)}
          />
        )}

        {showShareModal && <Share roomCode={roomCode} onClose={() => setShowShareModal(false)} />}
      </div>
    </div>
  );
}

export default StudyTable;
