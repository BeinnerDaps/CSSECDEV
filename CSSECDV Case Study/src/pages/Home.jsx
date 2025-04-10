import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => handleNavigation("/signin")}
        style={{ padding: "10px", backgroundColor: "#808080", color: "white", borderRadius: "5px"}}
        >Sign In</button>
      <button onClick={() => handleNavigation("/signup")}
        style={{ padding: "10px", backgroundColor: "#808080", color: "white", borderRadius: "5px"}}
        >Sign Up</button>
    </div>
  );
};

export default Home;
