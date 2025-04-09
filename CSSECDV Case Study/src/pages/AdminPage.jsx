import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { getPosts } from "../hooks/Posts";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { session, signOutUser, checkUserRole } = userAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const { posts, loading, error } = getPosts();

  useEffect(() => {
    const fetchRole = async () => {
      if (session && session.user) {
        const userRole = await checkUserRole(session.user.id);
        setRole(userRole);
      }
    };
    fetchRole();
  }, [session, checkUserRole]);

  const handleAdmin = async (e) => {
    e.preventDefault();
    if (role === "admin") {
      navigate("/admin");
    } else {
      console.error("Redirect error: Unauthorized user role.");
    }
  };

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
      <h1>Admin Page</h1>
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

export default AdminPage;
