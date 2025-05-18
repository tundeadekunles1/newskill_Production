import React, { useState, useEffect } from "react";
import "../styles/skillmatches.css";
import api from "../api/api";

function SkillMatches() {
  const [searchSkill, setSearchSkill] = useState("");
  const [mySkillsWanted, setMySkillsWanted] = useState([]);
  const [matches, setMatches] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMySkills();
    fetchMyRequests();
  }, []);

  const fetchMySkills = async () => {
    setLoadingSkills(true);
    try {
      const { data } = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMySkillsWanted(data.skillsWanted || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your skills.");
    } finally {
      setLoadingSkills(false);
    }
  };

  const requestSession = async (teacherId, skill) => {
    try {
      const res = await api.post(
        "/sessions/create",
        {
          teacherId,
          skill,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Session request sent successfully! 🎉");
    } catch (error) {
      console.error("Error requesting session:", error);
      alert("Failed to request session. Please try again.");
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data } = await api.get("/match/my-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMyRequests(data.requests || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your match requests.");
    }
  };

  const handleSearch = async () => {
    if (!searchSkill) return;
    setLoadingMatches(true);
    try {
      const { data } = await api.get(
        `/match/search?skill=${encodeURIComponent(searchSkill)}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMatches(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch matches.");
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleMatch = async (teacherId) => {
    try {
      await api.post(
        "/match/request",
        { teacherId, skill: searchSkill },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // After matching, fetch again
      await fetchMyRequests();
    } catch (err) {
      console.error(err);

      alert("Failed to send match request.");
    }
  };

  const checkRequestStatus = (teacherId) => {
    const request = myRequests.find((r) => r.teacherId === teacherId);
    if (request) {
      return request.status; // "waiting" or "approved"
    }
    return null;
  };

  const handleStartLearning = (teacherId) => {
    alert(`Starting session with teacher ${teacherId}!`);
  };

  return (
    <div className="skill-matches-container1">
      <h2>Find a Skill Teacher</h2>

      {loadingSkills ? (
        <p>Loading your skills...</p>
      ) : (
        <div className="search-section">
          <select
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          >
            <option value="">-- Select Skill to Learn --</option>
            {mySkillsWanted.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          <button onClick={handleSearch} disabled={!searchSkill}>
            {loadingMatches ? "Searching..." : "Search"}
          </button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="matches-list">
        {matches.length > 0 ? (
          matches.map((teacher) => {
            const status = checkRequestStatus(teacher._id);

            return (
              <div key={teacher._id} className="match-card">
                <h3>{teacher.fullName || "Unnamed Teacher"}</h3>
                <p>{teacher.bio || "No bio available."}</p>

                {status === "pending" && (
                  <p className="waiting-text">Waiting for approval...</p>
                )}

                {status === "approved" ? (
                  <button
                    className="start-learning-btn"
                    onClick={() => handleStartLearning(teacher._id)}
                  >
                    Start Learning
                  </button>
                ) : (
                  !status && (
                    <button
                      className="match-btn"
                      onClick={() => handleMatch(teacher._id)}
                    >
                      Match
                    </button>
                  )
                )}
              </div>
            );
          })
        ) : (
          <p>No matches found. Try searching for a skill!</p>
        )}
      </div>
    </div>
  );
}

export default SkillMatches;
