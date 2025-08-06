import React, { useState } from "react";
import {
  HiArrowCircleDown,
  HiClipboardCheck,
  HiBookOpen,
  HiOutlineColorSwatch,
} from "react-icons/hi";
import { PiCopySimpleThin, PiXCircleBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "../App.css";

const menuItems = [
  { icon: HiClipboardCheck, label: "Dashboard", route: "/dashboard" },
  { icon: HiArrowCircleDown, label: "Upload", route: "/upload" },
  { icon: HiOutlineColorSwatch, label: "Flashcards", route: "/flashcards" },
  { icon: HiBookOpen, label: "Study Tables", route: "/studytable" },
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          top: 20,
          left: open ? 220 : 20,
          zIndex: 1001,
          transition: "left 0.3s",
          borderRadius: 8,
          padding: "8px 12px",
          background: open ? "rgba(231, 225, 225, 0.3)" : "rgba(25, 61, 37, 0.3)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          color: open ? "#ec3e38ff": "#8bfcb6",
          border: "none",
          cursor: "pointer",
          marginTop: 80,
        }}
      >
        {open ? <PiXCircleBold/> : "Options"}
      </button>
      <div
        className="sidebar"
        style={{
          width: open ? 200 : 0,
          overflow: "hidden",
          transition: "width 0.3s",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          background: "#292b49ff",
          zIndex: 1000,
        }}
      >
        <ul className="sidebar-items" style={{ padding: open ? "20px 0" : 0 }}>
          {open &&
            menuItems.map((item, index) => (
              <li
                key={index}
                className="sidebar-item"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(item.route)}
              >
                <item.icon className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;