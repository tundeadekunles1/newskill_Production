import React, { useState, useEffect } from "react";
import "../styles/profile-settings.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const SKILL_OPTIONS = [
  "Web Development",
  "Graphic Design",
  "Data Science",
  "Digital Marketing",
  "Writing",
  "Photography",
  "Video Production",
  "Mobile App Development",
  // We can ddd more as needed
];

function ProfileSettings() {
  const navigate = useNavigate();

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  // Load existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data;
        setSkillsOffered(data.skillsOffered || []);
        setSkillsWanted(data.skillsWanted || []);
        setQualification(data.qualification || "");
        setBio(data.bio || "");
        setPreview(data.profilePicUrl || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const removeSkill = (skill, type) => {
    if (type === "offered") {
      setSkillsOffered(skillsOffered.filter((s) => s !== skill));
    } else if (type === "wanted") {
      setSkillsWanted(skillsWanted.filter((s) => s !== skill));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("skillsOffered", JSON.stringify(skillsOffered));
    formData.append("skillsWanted", JSON.stringify(skillsWanted));
    formData.append("qualification", qualification);
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      const res = await api.patch("/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(" Profile updated");
      setMessage("Profile updated! Redirecting...");

      // Store new token with updated hasCompletedProfile flag
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(" Error updating profile:", err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="profile-settings-container">
      <h2>Profile Settings</h2>
      <form onSubmit={handleSave} className="profile-settings-form">
        {/* Skills Offered */}
        <label>Skills Offered:</label>
        <select
          value=""
          onChange={(e) => {
            const value = e.target.value;
            if (value && !skillsOffered.includes(value)) {
              setSkillsOffered([...skillsOffered, value]);
            }
          }}
        >
          <option value="">-- Select a Skill --</option>
          {SKILL_OPTIONS.filter((skill) => !skillsOffered.includes(skill)).map(
            (skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            )
          )}
        </select>

        <div className="selected-skills">
          {skillsOffered.map((skill) => (
            <span key={skill} className="skill-badge">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill, "offered")}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Skills Wanted */}
        <label>Skills Wanted:</label>
        <select
          value=""
          onChange={(e) => {
            const value = e.target.value;
            if (value && !skillsWanted.includes(value)) {
              setSkillsWanted([...skillsWanted, value]);
            }
          }}
        >
          <option value="">-- Select a Skill --</option>
          {SKILL_OPTIONS.filter((skill) => !skillsWanted.includes(skill)).map(
            (skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            )
          )}
        </select>

        <div className="selected-skills">
          {skillsWanted.map((skill) => (
            <span key={skill} className="skill-badge">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill, "wanted")}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Qualification */}
        <label>Academic Qualification:</label>
        <input
          type="text"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          placeholder="e.g., B.Sc. Computer Science"
        />

        {/* Bio */}
        <label>Bio:</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself…"
        />

        {/* Profile Picture */}
        <label>Profile Picture:</label>
        {preview && (
          <img src={preview} alt="Preview" className="profile-preview" />
        )}
        <input type="file" accept="image/*" onChange={handlePicChange} />

        <button type="submit" className="save-btn">
          Save
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ProfileSettings;
