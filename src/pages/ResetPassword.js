import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import api from "../api/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMsg(res.data.message || "Password updated successfully.");

      // Redirect to signin after short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid or expired token.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </div>
  );
};

export default ResetPassword;
