import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { getPosts } from "../hooks/Posts";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => handleNavigation("/signin")}>Sign In</button>
      <button onClick={() => handleNavigation("/signup")}>Sign Up</button>
    </div>
  );
};

export default Home;
