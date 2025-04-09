import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getPosts } from "../hooks/Posts";
import { useNavigate } from "react-router-dom";

const ProdManPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { posts, postError, postLoading } = getPosts();

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
      await signOutUser();
      navigate("/settings");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (postLoading) return <p>Loading posts...</p>;

  if (roleError) return <p>Error fetching user role: {roleError}</p>;
  if (postError) return <p>Error fetching posts: {postError}</p>;

  return (
    <div>
      <h1>Product Manager Page</h1>
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

export default ProdManPage;
