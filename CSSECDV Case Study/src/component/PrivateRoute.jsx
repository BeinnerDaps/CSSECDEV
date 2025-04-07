import React from "react";
import { userAuth } from "../context/Authcontext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  return <>{session ? <>{children}</> : <Navigate to="/signin" />} </>;
};

export default PrivateRoute;
