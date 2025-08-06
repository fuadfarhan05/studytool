import React from "react";
import {
  HiPlus,
  HiUserCircle,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SideBar from "./sidebar";

const menuItems = [
  { icon: HiPlus, label: "Create", route: "/createcards" },
  { icon: HiUserCircle, label: "MyStuff", route: "/mystuff" },
];

function StudioNavbar() {
  const navigate = useNavigate();

  return (
    <div>
      
    <nav
      className="studio-navbar"
      style={{
        position: "fixed",
        left: 0,
        width: "100vw",
        height: 100,
        background: "#23272f",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 0",
        zIndex: 1000,
      }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          className="studio-navbar-item"
          style={{
            width: "400px",
            margin: "10px",
            background: "rgba(255, 255, 255, 0.1)", // semi-transparent white
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)", // this creates the glass blur
            WebkitBackdropFilter: "blur(10px)", // for Safari
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            color: "#8bfcb6",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem", // optional for spacing
          }}
          onClick={() => navigate(item.route)}
        >
          <item.icon size={32} />
          <span style={{ fontSize: 14, marginTop: 4 }}>{item.label}</span>
        </button>
      ))}
    </nav>
    <SideBar />
    </div>
  );
}

export default StudioNavbar;