import { useState, useEffect } from "react";
import "../styles/teachermatches.css";
import api from "../api/api";

const TeacherMatches = () => {
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/match/teacher-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setTeacherRequests(res.data || []);
    } catch (error) {
      console.error("Failed to fetch teacher requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (matchRequestId) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Approve match request
      await api.put(`/match-requests/${matchRequestId}/approve`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Create session
      await api.post(
        `/sessions/${matchRequestId}`,
        { matchRequestId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh list
      fetchRequests();
    } catch (err) {
      console.error("Error approving match and creating session:", err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await api.delete(`/match/decline-request/${requestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setTeacherRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Failed to decline request:", error);
    }
  };

  return (
    <div className="teacher-matches-container">
      <h2 className="teacher-matches-title">Skill Session Requests</h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : Array.isArray(teacherRequests) && teacherRequests.length > 0 ? (
        teacherRequests.map((request) => (
          <div key={request._id} className="teacher-request-card">
            <div className="teacher-request-info">
              <h3>{request.fullName}</h3>
              <p>
                <strong>Skill Requested:</strong> {request.skill}
              </p>
              <p>{request.bio}</p>
            </div>

            {request.status === "approved" ? (
              <p className="approved-text">✅ Approved</p>
            ) : (
              <div className="button-group">
                <button
                  onClick={() => handleAccept(request._id)}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(request._id)}
                  className="decline-button"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No skill session requests at the moment.</p>
      )}
    </div>
  );
};

export default TeacherMatches;
