import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Welcome from "../components/Welcome";
import SkillMatches from "../components/SkillMatches";
import Messages from "../components/Messages";
import Notifications from "../components/Notifications";
import Analytics from "../components/Analytics";
import ProfileSettings from "../components/ProfileSettings";
import SkillSessions from "../components/SkillSessions";
import TeacherMatches from "../components/TeacherMatches";
import Session from "../components/Session";
import "../styles/dashboard.css";
import ScheduleSession from "../components/ScheduleSession";
import UnifiedCalendar from "../components/UnifiedCalendar";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onProfilePage = location.pathname.includes("profile-settings");
    if (user && !user.hasCompletedProfile && !onProfilePage) {
      navigate("/dashboard/profile-settings");
    }
  }, [user, location, navigate]);

  return (
    <div className="dashboard-container">
      <Topbar onLogout={logout} />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <Routes>
            <Route index element={<Welcome />} />
            <Route path="matches" element={<SkillMatches />} />
            <Route path="teacher-matches" element={<TeacherMatches />} />
            <Route path="skillsessions" element={<SkillSessions />} />

            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile-settings" element={<ProfileSettings />} />
            <Route path="sessions" element={<Session />} />
            <Route path="sessions/schedule/:id" element={<ScheduleSession />} />
            <Route
              path="sessions/unifiedcalendar"
              element={<UnifiedCalendar userId={user.userId} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
