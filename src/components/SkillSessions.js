import React, { useEffect, useState } from "react";
import "../styles/skillsessions.css";
import api from "../api/api";

const SkillSession = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkillSessions();

    const interval = setInterval(() => {
      fetchSkillSessions(); // live polling every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const fetchSkillSessions = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await api.get("/match/my-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyRequests(res.data.requests);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch skill sessions:", error);

      setLoading(false);
    }
  };

  const handleStartLearning = (teacherId) => {
    console.log("Starting session with teacher:", teacherId);
    // navigate to video chat
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await api.delete(`/match/cancel/${requestId}`, {
        withCredentials: true,
      });
      fetchSkillSessions(); // refresh list
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutesAgo = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (minutesAgo < 1) return "just now";
    if (minutesAgo === 1) return "1 minute ago";
    return `${minutesAgo} minutes ago`;
  };

  return (
    <div className="skill-session-container">
      <h2> My Skill Sessions</h2>

      {loading ? (
        <p>Loading sessions...</p>
      ) : myRequests.length === 0 ? (
        <p>No active skill sessions yet.</p>
      ) : (
        myRequests.map((request) => (
          <div key={request._id} className="session-card">
            <h3>👩‍🏫 Teacher: {request.teacherId?.fullName || "Loading..."}</h3>
            <p>Skill: {request.skill || "Not specified"}</p>
            <p className={`status-text ${request.status}`}>
              Status: {request.status}
            </p>
            <p className="requested-time">
              Requested: {formatTimeAgo(request.createdAt)}
            </p>

            {request.status === "pending" ? (
              <>
                <p className="waiting-text">Waiting for teacher approval...</p>
                <button
                  className="cancel-button"
                  onClick={() => handleCancelRequest(request._id)}
                >
                  Cancel Request
                </button>
                <button
                  className="message-button"
                  onClick={() =>
                    console.log("Messaging teacher", request.teacherId._id)
                  }
                >
                  Message Teacher
                </button>
              </>
            ) : request.status === "approved" ? (
              <>
                <button
                  className="start-learning-button"
                  onClick={() => handleStartLearning(request.teacherId._id)}
                >
                  🚀 Start Learning
                </button>
              </>
            ) : (
              <p className="rejected-text">❌ Request rejected by teacher.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SkillSession;
