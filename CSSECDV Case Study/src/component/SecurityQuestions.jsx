import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const ReauthenticateForSecurity = () => {
  const navigate = useNavigate();
  const { session, signInUser } = userAuth();
  const [password, setPassword] = useState("");
  const [reauthenticated, setReauthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReauthenticate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = session?.user?.email;
    if (!email) {
      setError("User email not found.");
      return;
    }

    // Attempt to sign in using the provided password
    try {
      const result = await signInUser(email, password);

      if (result.success) {
        setReauthenticated(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render the reauthentication form first.
  if (!reauthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Reauthenticate</h2>
        <p className="text-gray-300 mb-4">Please enter your password to access your security questions.</p>
        <form onSubmit={handleReauthenticate} className="flex flex-col max-w-2/5 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-600"
            >
              Submit
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
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    );
  }

  // Once reauthenticated, show the security questions form.
  return <SecurityQuestions />;
};

const SecurityQuestions = () => {
  const { session, getSecurityQuestions, setSecurityAnswers } = userAuth();
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
    const { success, error } = await setSecurityAnswers(
      user_id,
      answers.security_answer1,
      answers.security_answer2
    );
    if (success) {
      setAnswered(true);
      setMessage("Security answers updated successfully.");
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading)
    return (
      <p className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
        Loading security questions...
      </p>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Answer Your Security Questions</h2>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-2/5 space-y-4">
        <div className="my-4 bg-gray-700 p-4 rounded-md">
          <p className="mb-2 text-gray-300">
            <strong>Question 1:</strong> {questions.security_question1}
          </p>
          <label htmlFor="security_answer1" className="block text-sm font-medium text-gray-300 mb-1">
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
          <label htmlFor="security_answer2" className="block text-sm font-medium text-gray-300 mb-1">
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
};

export default ReauthenticateForSecurity;
