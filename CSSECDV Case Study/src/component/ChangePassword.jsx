import React, { useState, useEffect } from "react";
import { userAuth } from "../context/Authcontext";
import { Link, useNavigate } from "react-router-dom";

const authenticateSecurityQuestions = () => {
  const { session, getSecurityQuestions, checkSecurityAnswers } = userAuth();
  const user_id = session?.user?.id;
  const navigate = useNavigate();

  const [questions, setQuestions] = useState({
    security_question1: "",
    security_question2: "",
  });
  const [answers, setAnswers] = useState({
    security_answer1: "",
    security_answer2: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { success, data, error } = await getSecurityQuestions(user_id);
      if (success) {
        setQuestions(data);
      } else {
        setMessage(`Error: ${error.message}`);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [user_id, getSecurityQuestions]);

  const handleInputChange = (e) => {
    setAnswers((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, error } = await checkSecurityAnswers(
      user_id,
      answers.security_answer1,
      answers.security_answer2
    );

    console.log(answered);

    if (success) {
      setAnswered(true);
    } else {
      setMessage("Error:", error);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <p className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
        Loading security questions...
      </p>
    );

  if (!answered) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Answer Your Security Questions
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col max-w-2/5 space-y-4"
        >
          <div className="my-4 bg-gray-700 p-4 rounded-md">
            <p className="mb-2 text-gray-300">
              <strong>Question 1:</strong> {questions.security_question1}
            </p>
            <label
              htmlFor="security_answer1"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Answer 1:
              <input
                type="text"
                id="security_answer1"
                name="security_answer1"
                value={answers.security_answer1}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
          </div>

          <div className="my-4 bg-gray-700 p-4 rounded-md">
            <p className="mb-2 text-gray-300">
              <strong>Question 2:</strong> {questions.security_question2}
            </p>
            <label
              htmlFor="security_answer2"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Answer 2:
              <input
                type="text"
                id="security_answer2"
                name="security_answer2"
                value={answers.security_answer2}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
          </div>

          <div className="space-x-2">
            <button
              type="submit"
              disabled={loading || answered}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-600 disabled:opacity-50"
            >
              Submit Answers
            </button>

            <button
              type="button"
              disabled={loading}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-600"
              onClick={() => navigate("/settings")}
            >
              Go Back
            </button>
          </div>
        </form>

        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    );
  }

  return <ChangePassword />;
};

const ChangePassword = () => {
  const { session, signInUser, updatePassword, signOutUser } = userAuth();
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

      console.log("Password updated successfully!");
      await signOutUser();
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
              Password changed successfully!
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
              onClick={() =>
                success ? navigate("/signin") : navigate("/settings")
              }
              disabled={loading}
              className=" text-white font-bold py-2 px-4 rounded-md"
            >
              {success ? "Sign in again" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default authenticateSecurityQuestions;
