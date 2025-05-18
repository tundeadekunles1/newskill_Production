import api from "../api/api";
import { useState, useEffect } from "react";

const SessionProgress = ({ scheduleId }) => {
  const [schedule, setSchedule] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await api.get(`/session-schedules/${scheduleId}`);
      setSchedule(response.data);
      setProgress(response.data.progress.completionPercentage);
    };
    fetchSchedule();
  }, [scheduleId]);

  const updateSessionStatus = async (sessionId, status) => {
    await api.patch(
      `/api/session-schedules/${scheduleId}/sessions/${sessionId}`,
      { status }
    );
    // Refetch to update progress
    const updated = await api.get(`/session-schedules/${scheduleId}`);
    setSchedule(updated.data);
    setProgress(updated.data.progress.completionPercentage);
  };

  return (
    <div className="progress-container">
      <h3>Learning Progress</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}>
          {progress}%
        </div>
      </div>

      <div className="session-list">
        {schedule?.allSessions.map((session) => (
          <div key={session._id} className={`session-card ${session.status}`}>
            <h4>{new Date(session.date).toLocaleDateString()}</h4>
            <p>
              {session.startTime} - {session.endTime}
            </p>
            <p>Status: {session.status}</p>

            {session.status === "scheduled" && (
              <div className="session-actions">
                <button
                  onClick={() => updateSessionStatus(session._id, "completed")}
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => updateSessionStatus(session._id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
