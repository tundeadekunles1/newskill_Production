import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";
import "../styles/modal.css";
import logo from "../assets/3mmt logo.png";

import SignIn from "../pages/SignInPage";
import SignUp from "../pages/SignUpPage";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Modal handlers
  const openModal = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-left">
            <img
              className="logo"
              src={logo}
              alt="logo"
              width="200px"
              height="200px"
            />

            <div className={`nav-items ${menuOpen ? "open" : ""}`}>
              <select className="browse-category">
                <option>Browse Categories</option>
                <option>Web Development</option>
                <option>Graphic Design</option>
                <option>Digital Marketing</option>
              </select>

              <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <button className="search-icon">
                  <FaSearch />
                </button>
              </div>

              <a className="learn_a_skill" href="#home">
                Learn a Skill
              </a>
              <a className="learn_a_skill" href="#home">
                Teach a Skill
              </a>

              <div className="sigIn_signUp">
                <button className="sign-in" onClick={() => openModal("signin")}>
                  Sign In
                </button>
                <button className="sign-up" onClick={() => openModal("signup")}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}>
              ×
            </button>
            {authMode === "signup" ? (
              <SignUp switchToSignIn={() => setAuthMode("signin")} />
            ) : (
              <SignIn switchToSignUp={() => setAuthMode("signup")} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
