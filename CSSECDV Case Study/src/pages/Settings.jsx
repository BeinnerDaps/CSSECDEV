import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
        >
          Dashboard
        </button>
        <button
          onClick={() => handleNavigation("/security-questions")}
          className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
        >
          Security Questions
        </button>
        <button
          onClick={() => handleNavigation("/change-password")}
          className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
