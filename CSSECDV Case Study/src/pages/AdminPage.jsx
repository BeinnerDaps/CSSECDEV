import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { useNavigate } from "react-router-dom";
import { getLogs } from "../hooks/Logs";

const AdminPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { logs, logsError, logsLoading } = getLogs();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSettings = async (e) => {
    e.preventDefault();
    try {
      navigate("/settings");
    } catch (error) {
      console.error("Error navigating to settings:", error.message);
    }
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (roleError) return <p>Error fetching user role: {roleError}</p>;
  if (logsLoading) return <p>Loading logs...</p>;
  if (logsError) return <p>Error fetching logs: {logsError}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <h2 className="text-lg mb-2">Welcome, {session?.user?.email}</h2>
      <h3 className="text-md mb-4">Role: {role ? role : "Loading..."}</h3>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
        <button
          onClick={handleSettings}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Settings
        </button>
      </div>

      {/* Log Table Section */}
      <div className="bg-white p-4 shadow-md rounded-md mb-8 text-black">
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
                <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
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
    </div>
  );
};

export default AdminPage;
