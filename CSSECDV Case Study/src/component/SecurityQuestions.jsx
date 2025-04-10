import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const SecurityQuestions = () => {
  const { session, getSecurityQuestions, setSecurityAnswers } = userAuth();
  const user_id = session?.user?.id;
  const [questions, setQuestions] = useState({
    security_question1: "",
    security_question2: "",
  });
  const [answers, setAnswers] = useState({
    security_answer1: "",
    security_answer2: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { success, data, error } = await getSecurityQuestions(user_id);
      if (success) {
        setQuestions(data);
      } else {
        setResult(`Error: ${error.message}`);
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
      setResult("Security answers updated successfully.");
    } else {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Answer Your Security Questions</h2>
      <div>
        <p>
          <strong>Question 1:</strong> {questions.security_question1}
        </p>
        <p>
          <strong>Question 2:</strong> {questions.security_question2}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="security_answer1">
            Answer 1:
            <input
              type="text"
              id="security_answer1"
              name="security_answer1"
              value={answers.security_answer1}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="security_answer2">
            Answer 2:
            <input
              type="text"
              id="security_answer2"
              name="security_answer2"
              value={answers.security_answer2}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit">Submit Answers</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
};

export default SecurityQuestions;
