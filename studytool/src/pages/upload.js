import React from "react";
import { HiArrowCircleDown } from "react-icons/hi";
import "../App.css";
import Sidebar from "../component/sidebar";

function Upload() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh"
    }}>
      <div style={{
        width: 500,
        height: 500,
        border: "5px dashed #8bfcb6",
        borderRadius: 18,
        background: "#23272f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 24px 6px #8bfcb6",
      }}>
        <Sidebar />
        <h2 style={{ color: "#8bfcb6", marginBottom: 20 }}>Upload Files</h2>
        <HiArrowCircleDown size={80} color="#8bfcb6" />
        
      </div>
    </div>
  );
}

export default Upload;