import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const ResetPassword = () => {
  const { setTemporarySession, updatePassword } = userAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("access_token");
  const type = searchParams.get("type");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setupSession = async () => {
      if (token && type === "recovery") {
        try {
          await setTemporarySession(token);
        } catch (error) {
          setError("Failed to set temporary session.");
        }
      }
    };
    setupSession();
  }, [token, type, setTemporarySession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await updatePassword(password);
      if (result.success) {
        setMessage("Password changed successfully!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Enter New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter New Password"
              />
            </div>

            {error && <div className="text-center text-red-500">{error}</div>}
            {message && (
              <div className="text-center text-green-500">{message}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
