import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <NavLink to="/dashboard" end>
        Home
      </NavLink>
      <NavLink to="/dashboard/matches">Skill Matches</NavLink>
      <NavLink to="/dashboard/teacher-matches">Teaching Requests</NavLink>
      <NavLink to="/dashboard/skillsessions">Learning Requests</NavLink>
      <NavLink to="/dashboard/sessions">Sessions</NavLink>
      <NavLink to="/dashboard/messages">Messages</NavLink>
      <NavLink to="/dashboard/notifications">Notifications</NavLink>
      <NavLink to="/dashboard/analytics">Analytics</NavLink>
      <NavLink to="/dashboard/profile-settings">Profile Settings</NavLink>
    </div>
  );
}

export default Sidebar;
