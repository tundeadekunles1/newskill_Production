import React from "react";
import SignUp from "../pages/SignUpPage";
import SignIn from "../pages/SignInPage";
import "../styles/authmodal.css";

const AuthModal = ({ isOpen, onClose, mode }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {mode === "signup" ? <SignUp /> : <SignIn />}
        <button className="close-modal-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
