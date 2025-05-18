import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/schedulesession.css";
import api from "../api/api";

const ScheduleSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "14:00",
    endTime: "15:00",
    totalWeeks: 4,
    sessionsPerWeek: 2,
    daysOfWeek: [1, 3], // Default: Monday, Wednesday (numerical representation)
    sessionNotes: "",
    learningObjectives: [""],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dayOptions, setDayOptions] = useState([
    { value: 0, label: "Sunday", checked: false },
    { value: 1, label: "Monday", checked: true },
    { value: 2, label: "Tuesday", checked: false },
    { value: 3, label: "Wednesday", checked: true },
    { value: 4, label: "Thursday", checked: false },
    { value: 5, label: "Friday", checked: false },
    { value: 6, label: "Saturday", checked: false },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/sessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSession(data);
      } catch (err) {
        setError("Failed to fetch session details");
        console.error("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDayChange = (value) => {
    const updatedDays = dayOptions.map((day) =>
      day.value === value ? { ...day, checked: !day.checked } : day
    );

    setDayOptions(updatedDays);
    setFormData({
      ...formData,
      daysOfWeek: updatedDays
        .filter((day) => day.checked)
        .map((day) => day.value),
    });
  };

  const handleObjectiveChange = (index, value) => {
    const updatedObjectives = [...formData.learningObjectives];
    updatedObjectives[index] = value;
    setFormData({ ...formData, learningObjectives: updatedObjectives });
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      learningObjectives: [...formData.learningObjectives, ""],
    });
  };

  const removeObjective = (index) => {
    const updatedObjectives = formData.learningObjectives.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, learningObjectives: updatedObjectives });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate at least one day is selected
    if (formData.daysOfWeek.length === 0) {
      setError("Please select at least one day for sessions");
      setLoading(false);
      return;
    }

    // Validate sessions per week matches selected days
    if (formData.daysOfWeek.length < formData.sessionsPerWeek) {
      setError("Sessions per week cannot exceed selected days");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        sessionId: id,
        startDate: formData.startDate,
        totalWeeks: parseInt(formData.totalWeeks),
        sessionsPerWeek: parseInt(formData.sessionsPerWeek),
        daysOfWeek: formData.daysOfWeek,
        timeSlot: {
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        initialNotes: formData.sessionNotes,
        learningObjectives: formData.learningObjectives.filter(
          (obj) => obj.trim() !== ""
        ),
      };

      const response = await api.post("/session-schedules", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      // Update session status to scheduled
      await api.patch(
        `/sessions/${id}`,
        { status: "scheduled" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/dashboard/sessions", {
        state: { success: "Session scheduled successfully!" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule sessions");
      console.error("Scheduling error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading session details...</div>;
  if (!session) return <div className="error">Session not found</div>;

  return (
    <div className="schedule-session-container">
      <h2>Schedule Session</h2>
      <div className="session-info">
        <p>
          <strong>Skill:</strong> {session.skill}
        </p>
        <p>
          <strong>Learner:</strong>{" "}
          {session.learner?.fullName || "Not specified"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="form-section">
          <h3>Session Timing</h3>

          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="time-grid">
            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time:</label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Schedule Configuration</h3>

          <div className="form-group">
            <label htmlFor="totalWeeks">Total Weeks:</label>
            <input
              id="totalWeeks"
              type="number"
              name="totalWeeks"
              min="1"
              max="12"
              value={formData.totalWeeks}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sessionsPerWeek">Sessions per Week:</label>
            <input
              id="sessionsPerWeek"
              type="number"
              name="sessionsPerWeek"
              min="1"
              max="7"
              value={formData.sessionsPerWeek}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Days of Week:</label>
            <div className="day-options">
              {dayOptions.map((day) => (
                <div key={day.value} className="day-checkbox">
                  <input
                    type="checkbox"
                    id={`day-${day.value}`}
                    checked={day.checked}
                    onChange={() => handleDayChange(day.value)}
                  />
                  <label htmlFor={`day-${day.value}`}>{day.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Session Details</h3>

          <div className="form-group">
            <label htmlFor="sessionNotes">Initial Notes:</label>
            <textarea
              id="sessionNotes"
              name="sessionNotes"
              value={formData.sessionNotes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Learning Objectives:</label>
            {formData.learningObjectives.map((obj, index) => (
              <div key={index} className="objective-input">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder="Enter learning objective"
                />
                {formData.learningObjectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addObjective} className="add-btn">
              + Add Objective
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !formData.startDate}
            className="submit-btn"
          >
            {loading ? "Scheduling..." : "Confirm Schedule"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/sessions")}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleSession;
