import React from "react";
import { HiPlus, HiUserCircle } from "react-icons/hi";
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
          bottom: 0, // Bottom navbar for mobile feel
          left: 0,
          width: "100%",
          height: "70px",
          background: "rgba(35, 39, 47, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "0 10px",
          zIndex: 1000,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="studio-navbar-item"
            style={{
              flex: 1,
              margin: "0 5px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              color: "#8bfcb6",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 0",
              transition: "transform 0.2s ease, background 0.3s ease",
            }}
            onClick={() => navigate(item.route)}
            onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.95)"}
            onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
          >
            <item.icon size={24} />
            <span style={{ fontSize: 12, marginTop: 4 }}>{item.label}</span>
          </button>
        ))}
      </nav>
      <SideBar />
    </div>
  );
}

export default StudioNavbar;
