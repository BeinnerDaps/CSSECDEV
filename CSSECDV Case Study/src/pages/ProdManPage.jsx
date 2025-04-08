import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import readPosts from "../hooks/readPosts";
import { useNavigate } from "react-router-dom";

const ProdManPage = () => {
  const { session, signOutUser, checkUserRole } = userAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const { posts, loading, error } = readPosts();

  useEffect(() => {
    const fetchRole = async () => {
      if (session && session.user) {
        const userRole = await checkUserRole(session.user.id);
        setRole(userRole);
      }
    };
    fetchRole();
  }, [session, checkUserRole]);

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

  return (
    <div>
      <h1>Product Manager Page</h1>
      <h1>Welcome, {session?.user?.email}</h1>
      <h2>Role: {role ? role : "Loading..."}</h2>

      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div>
        <button onClick={handleSettings}>Sign Out</button>
      </div>

      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
};

export default ProdManPage;
