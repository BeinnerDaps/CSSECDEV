import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { useNavigate } from "react-router-dom";
import { insertLog } from "../hooks/Logs";

const AdminPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { logs, logsError, logsLoading } = insertLog();

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
  if (logsLoading) return <p>Loading logs...</p>;
  if (logsError) return <p>Error fetching logs: {logsError}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Page</h1>
      <h2 className="text-xl mb-4">Welcome, {session?.user?.email}</h2>
      <h3 className="text-lg mb-6">Role: {role ? role : "Loading..."}</h3>

      <div className="space-y-4 w-full max-w-4xl">
        {/* Log Table Section */}
        <div className="bg-white p-6 rounded-md shadow-md text-black">
          <h2 className="text-xl font-semibold mb-4">Log Table</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID Number</th>
                <th className="text-left p-2">User ID</th>
                <th className="text-left p-2">Timestamp</th>
                <th className="text-left p-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id} className="border-b">
                  <td className="p-2">{index}</td>
                  <td className="p-2">{log.user_id}</td>
                  <td className="p-2">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">{log.message}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col space-y-4 items-center">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleSettings}
            className="bg-green-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
