import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <button onClick={() => handleNavigation("/dashboard")}>
            Dashboard
      </button>
      <button onClick={() => handleNavigation("/security-questions")}>
        Security Questions
      </button>
      <button onClick={() => handleNavigation("/change-password")}>
        Reset Password
      </button>
    </div>
  );
};

export default Settings;
