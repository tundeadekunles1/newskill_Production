import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/session.css";
import api from "../api/api";

const Session = () => {
  const navigate = useNavigate();
  const [learningSessions, setLearningSessions] = useState([]);
  const [teachingSessions, setTeachingSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("teaching");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSessions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [learningRes, teachingRes] = await Promise.all([
          api.get(`/sessions/learning`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/sessions/teaching`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLearningSessions(learningRes.data);
        setTeachingSessions(teachingRes.data);
      } catch (err) {
        setError("Failed to fetch sessions. Please try again.");
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  return (
    <div className="sessions-container">
      <h2>My Sessions</h2>
      {/* Tabs and Refresh Button */}
      <div className="header-actions">
        <div className="tabs">
          <button
            className={activeTab === "teaching" ? "active" : ""}
            onClick={() => setActiveTab("teaching")}
          >
            Teaching
          </button>
          <button
            className={activeTab === "learning" ? "active" : ""}
            onClick={() => setActiveTab("learning")}
          >
            Learning
          </button>
        </div>
      </div>
      {/* Loading/Error States */}
      {isLoading && <p className="status-message">Loading sessions...</p>}
      {error && <p className="error-message">{error}</p>}
      {/* Session Lists */}
      <div className="session-list">
        {activeTab === "teaching" && (
          <>
            {teachingSessions.length > 0 ? (
              <ul>
                {teachingSessions.map((session) => (
                  <li key={session._id}>
                    <div className="session-info">
                      <span>
                        Learner: {session.learnerId?.fullName || "Unknown"}
                      </span>
                      <span>Skill: {session.skill || "N/A"}</span>
                      <span>Status: {session.status || "Pending"}</span>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/sessions/schedule/${session._id}`)
                      }
                    >
                      Schedule
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              !isLoading && <p>No teaching sessions found.</p>
            )}
          </>
        )}

        {activeTab === "learning" && (
          <>
            {learningSessions.length > 0 ? (
              <ul>
                {learningSessions.map((session) => (
                  <li key={session._id}>
                    <div className="session-info">
                      <span>
                        Teacher: {session.teacherId?.fullName || "Unknown"}
                      </span>
                      <span>Skill: {session.skill || "N/A"}</span>
                      <span>Status: {session.status || "Pending"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              !isLoading && <p>No learning sessions found.</p>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/dashboard/sessions/unifiedcalendar")}
        className="calendarButton"
      >
        View in Calendar
      </button>
    </div>
  );
};

export default Session;
