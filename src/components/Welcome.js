import React from "react";
import "../styles/welcome.css";
import { useAuth } from "../contexts/AuthContext";

function Welcome() {
  const { user } = useAuth();
  return (
    <div className="welcome">
      <h3>Welcome, {user?.fullName || "User"}!</h3>
      <p>Let’s help you connect and grow.</p>
    </div>
  );
}

export default Welcome;
