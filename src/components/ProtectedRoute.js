import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for auth check to complete
  if (loading) {
    return <div>Loading...</div>; // we can still replace with spinner
  }

  return user ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
