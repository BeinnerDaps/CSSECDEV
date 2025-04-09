import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { getPosts } from "../hooks/Posts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Customer Page</h1>
      <h1>Welcome, {session?.user?.email}</h1>
      <h2>Role: {role ? role : "Loading..."}</h2>

      {role === "admin" && (
        <div>
          <button onClick={() => handleNavigation("/admin")}>Admin Page</button>
        </div>
      )}

      {role === "product_manager" && (
        <div>
          <button onClick={() => handleNavigation("/product-manager")}>
            Product Manager Page
          </button>
        </div>
      )}

      {role === "user" && (
        <div>
          <button onClick={() => handleNavigation("/user")}>
            Customer Page
          </button>
        </div>
      )}

      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div>
        <button onClick={handleSettings}>Settings</button>
      </div>
    </div>
  );
};

export default Dashboard;
