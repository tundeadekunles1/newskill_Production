import React from "react";
import "../styles/topbar.css";

function Topbar({ onLogout }) {
  return (
    <div className="topbar">
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Topbar;
