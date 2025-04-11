import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { session, signUpNewUser } = userAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Gmail-only validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      setError("Only Gmail addresses are allowed.");
      setLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(username, email, password);
      if (result.error) throw result.error;

      if (result.success) {
        navigate("/dashboard");
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
            Create an Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                required
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Create Username"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm your password"
              />
            </div>
            {error && <div className="text-center text-red-500">{error}</div>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
