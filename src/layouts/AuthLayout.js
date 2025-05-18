import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page-wrapper">
      <h1>Welcome to Skill Bridge</h1>
      <div className="auth-inner">{children}</div>
    </div>
  );
};

export default AuthLayout;
