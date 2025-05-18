import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./EventModal";
import api from "../api/api";

const UnifiedCalendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch sessions
      const sessionsRes = await api.get("/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessions = sessionsRes.data;

      // Fetch schedules
      const schedulesRes = await api.get("/session-schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const schedules = schedulesRes.data;

      // Transform to calendar events
      const allEvents = schedules.flatMap((schedule) => {
        const relatedSession = sessions.find(
          (s) => s._id === schedule.sessionId
        );
        if (!relatedSession) return [];

        return schedule.allSessions
          .map((session) => {
            try {
              const startDate = new Date(session.date);
              const [startHours, startMinutes] = schedule.timeSlot.startTime
                .split(":")
                .map(Number);
              const [endHours, endMinutes] = schedule.timeSlot.endTime
                .split(":")
                .map(Number);

              const start = new Date(startDate);
              start.setHours(startHours, startMinutes);

              const end = new Date(startDate);
              end.setHours(endHours, endMinutes);

              return {
                id: session._id?.$oid || session._id, // Support Mongo-style _id
                title: `${relatedSession.skill} (${
                  relatedSession.teacherId === userId ? "Teaching" : "Learning"
                })`,
                start,
                end,
                color:
                  relatedSession.teacherId === userId ? "#3182ce" : "#38a169",
                extendedProps: {
                  ...session,
                  sessionId: schedule.sessionId,
                  skill: relatedSession.skill,
                },
              };
            } catch (err) {
              console.error("Error processing session:", session, err);
              return null;
            }
          })
          .filter(Boolean); // Remove null values
      });

      setEvents(allEvents);
    } catch (err) {
      console.error("Axios fetch error:", err.response?.data || err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  const handleEventClick = (info) => {
    setSelectedEvent({
      ...info.event.extendedProps,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    });
  };

  if (loading) return <div>Loading calendar...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "90%", // Or adjust to 800px or any fixed width you prefer
          maxWidth: "1000px",
          height: "700px",
        }}
      >
        <FullCalendar
          height="80%"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events} // Pass the events here
          eventClick={handleEventClick}
        />

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
};

export default UnifiedCalendar;
