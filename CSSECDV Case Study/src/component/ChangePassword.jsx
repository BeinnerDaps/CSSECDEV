import React, { useState } from "react";
import { userAuth } from "../context/Authcontext";
import { Link, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { session, signInUser, updatePassword } = userAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Attempt to sign in using the provided password
    try {
      if (confirmPass !== newPass) {
        setMessage("Passwords do not match.");
        setLoading(false);
        return;
      }

      const email = session?.user?.email;
      if (!email) {
        setMessage("User email not found.");
        return;
      }
      const result = await signInUser(email, currPass);

      if (!result.success) {
        throw new Error(result.error);
      }

      const update = await updatePassword(newPass);

      if (!update.success) {
        throw new Error(update.error);
      }

      setSuccess(true);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>
      <div className="flex flex-col max-w-2/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Current Password
            </label>
            <input
              type="password"
              required
              onChange={(e) => setCurrPass(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Current Password"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              required
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter New Password"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              required
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm New Password"
            />
          </div>

          {message && <div className="text-center">{message}</div>}
          {success && (
            <div className="text-center text-green-500">
              Recovery email sent successfully!
            </div>
          )}

          <div className="space-x-2">
            <button
              type="submit"
              disabled={loading || success}
              className=" text-white font-bold py-2 px-4 rounded-md"
            >
              Change Password
            </button>

            <button
              type="button"
              onClick={() => navigate("/settings")}
              disabled={loading}
              className=" text-white font-bold py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
