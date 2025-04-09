import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { checkUserRole } from "../hooks/Roles";
import { getPosts } from "../hooks/Posts";
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const role = checkUserRole(session?.user?.id);
  const posts = getPosts();

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
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      <h1>Customer Page</h1>
      <h1>Welcome, {session?.user?.email}</h1>
      <h2>Role: {role ? role : "Loading..."}</h2>

      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div>
        <button onClick={handleSettings}>Settings</button>
      </div>

      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
};

export default CustomerPage;
