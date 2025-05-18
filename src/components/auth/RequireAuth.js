import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Redirect to profile settings if not completed and not already there
  if (
    !user.hasCompletedProfile &&
    location.pathname !== "/dashboard/profile-settings"
  ) {
    return <Navigate to="/dashboard/profile-settings" replace />;
  }

  return children;
};

export default RequireAuth;
