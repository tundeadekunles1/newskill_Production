import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Logo / Name */}
        <div className="footer-section">
          <h2 className="footer-logo">Skill Bridge</h2>
          <p>Connecting learners and teachers worldwide.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#home">Learn a Skill</a>
            </li>
            <li>
              <a href="#home">Teach a Skill</a>
            </li>
            <li>
              <a href="#home">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            <a href="#home">
              <FaFacebookF />
            </a>
            <a href="#home">
              <FaTwitter />
            </a>
            <a href="#home">
              <FaInstagram />
            </a>
            <a href="#home">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
