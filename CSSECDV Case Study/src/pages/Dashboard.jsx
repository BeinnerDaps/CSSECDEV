import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { insertLog } from "../hooks/Logs";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await insertLog(session?.user?.id, "Successfully signed out");
      await signOutUser();
      navigate("/");
    } catch (error) {
      await insertLog(session?.user?.id, "Error signing out");
      console.error("Error signing out:", error.message);
    }
  };

  const handleSettings = async (e) => {
    e.preventDefault();
    try {
      navigate("/settings");
    } catch (error) {
      await insertLog(session?.user?.id, "Error navigating to settings");
      console.error("Error navigating to settings:", error.message);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (roleError) return <p>Error fetching user role: {roleError}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <h1 className="text-xl mb-4">Welcome, {session?.user?.email}</h1>
      <h2 className="text-lg mb-6">Role: {role ? role : "Loading..."}</h2>

      <div className="space-y-4">
        {role === "admin" && (
          <button
            onClick={() => handleNavigation("/admin")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2 mt-4"
          >
            Admin Page
          </button>
        )}

        {role === "product_manager" && (
          <button
            onClick={() => handleNavigation("/product-manager")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2 mt-6"
          >
            Product Manager Page
          </button>
        )}

        {role === "user" && (
          <button
            onClick={() => handleNavigation("/user")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2 mt-8"
          >
            Customer Page
          </button>
        )}

        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white rounded-md py-2 px-4 w-1/2 mt-10"
        >
          Sign Out
        </button>

        <button
          onClick={handleSettings}
          className="bg-green-500 text-white rounded-md py-2 px-4 w-1/2 mt-12"
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
