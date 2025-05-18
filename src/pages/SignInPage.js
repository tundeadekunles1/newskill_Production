import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Correct custom hook
import "../styles/sigIn-page.css";
import api from "../api/api";
const SignIn = ({ switchToSignUp }) => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Only one login from context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const validateInputs = () => {
    const { email, password } = formData;
    if (!email || !password) {
      return "Please fill in all fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data.token) {
        setSuccess("Login successful!");
        login(response.data.token); // ✅ Login using context
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="signin-modal">
      <div className="signin-header">
        <button className="active-tab">Sign In</button>
      </div>
      <p className="switch-text">
        Don't have an account?
        <span onClick={switchToSignUp} className="link">
          Sign Up
        </span>
      </p>
      <button className="google-signin">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="G"
        />
        Sign in with Google
      </button>
      <div className="divider">
        <hr />
        <span>Or</span>
        <hr />
      </div>
      <form className="signin-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <button type="submit" className="submit-btn">
          Sign In
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
    </div>
  );
};

export default SignIn;
