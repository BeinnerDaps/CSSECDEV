import React from "react";
import { userAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

const mainpage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      <h1>Main Customer Page</h1>
      <h1>Welcome, {session?.user?.email}</h1>

      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default mainpage;
