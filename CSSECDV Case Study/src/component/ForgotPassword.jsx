import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const ForgotPassword = () => {
  const { session, sendPasswordRecovery } = userAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sendPasswordRecovery(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
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
                Enter Recovery Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Recovery Email"
              />
            </div>

            {error && <div className="text-center text-red-500">{error}</div>}
            {success && (
              <div className="text-center text-green-500">
                Recovery email sent successfully!
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                Send Recovery Email
              </button>
            </div>
          </form>

          <div className="mt-3 text-center">
            <button
              onClick={() => handleNavigation("/signin")}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              Return to Sign in
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm text-gray-400">
              Try another way:{" "}
              <Link
                to="/signin"
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Answer Security Questions
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
