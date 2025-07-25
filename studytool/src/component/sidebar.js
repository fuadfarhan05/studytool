import React, { useState } from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import "../App.css";

const menuItems = [
  { icon: HiUser, label: "Dashboard" },
  { icon: HiShoppingBag, label: "Upload" },
  { icon: HiTable, label: "Flashcards" },
  { icon: HiArrowSmRight, label: "Study Tables" },
];

function Sidebar() {
  const [open, setOpen] = useState(true);

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
          background: "#1d201eff",
          color: "#8bfcb6",
          border: "none",
          cursor: "pointer",
          marginTop: 80,
        }}
      >
        {open ? "Close" : "Options"}
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
          background: "#222429",
          zIndex: 1000,
        }}
      >
        <ul className="sidebar-items" style={{ padding: open ? "20px 0" : 0 }}>
          {open &&
            menuItems.map((item, index) => (
              <li key={index} className="sidebar-item">
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