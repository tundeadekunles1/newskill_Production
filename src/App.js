import { Routes, Route } from "react-router-dom";
import "../src/styles/App.css";
import LandingPage from "../src/pages/LandingPage";
import Header from "../src/layouts/Header";
import Footer from "../src/components/Footer";
import SignInPage from "../src/pages/SignInPage";
import SignUpPage from "../src/pages/SignUpPage";
import Dashboard from "../src/pages/Dashboard";
import ProfileSettings from "../src/components/ProfileSettings";
import { AuthProvider } from "../src/contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AuthLayout from "./layouts/AuthLayout";
import CheckEmail from "./components/CheckMail";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <AuthProvider>
      <>
        {!isDashboard && <Header />}
        <div className="App">
          <div className="innerContaine">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/verify/:token" element={<VerifyEmail />} />

              <Route
                path="/forgot-password"
                element={
                  <AuthLayout>
                    <ForgotPassword />
                  </AuthLayout>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <AuthLayout>
                    <ResetPassword />
                  </AuthLayout>
                }
              />

              {/* Profile Settings accessible even without profile completed */}
              <Route
                path="/dashboard/profile-settings"
                element={<ProfileSettings />}
              />

              {/*  Wrap protected dashboard route with RequireAuth */}
              <Route
                path="/dashboard/*"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
            </Routes>
            {!isDashboard && <Footer />} {/* hide on dashboard */}
          </div>
        </div>
      </>
    </AuthProvider>
  );
}

export default App;
