import React from "react";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const { title, start, end, extendedProps = {} } = event;
  const { role, notes, attendance } = extendedProps;

  return (
    <div
      className="event-modal"
      style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}
    >
      <h2>{title}</h2>
      <p>
        <strong>Start:</strong> {start?.toLocaleString?.()}
      </p>
      <p>
        <strong>End:</strong> {end?.toLocaleString?.()}
      </p>
      <p>
        <strong>Role:</strong>{" "}
        {role ? (role === "teaching" ? "Teaching" : "Learning") : "Unknown"}
      </p>
      {notes && (
        <p>
          <strong>Notes:</strong> {notes}
        </p>
      )}
      {attendance && (
        <p>
          <strong>Attendance:</strong> Teacher -{" "}
          {attendance.teacher ? "✔️" : "❌"}, Learner -{" "}
          {attendance.learner ? "✔️" : "❌"}
        </p>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EventModal;
