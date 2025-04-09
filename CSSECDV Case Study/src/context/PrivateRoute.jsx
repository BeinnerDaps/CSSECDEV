import React, { useState, useEffect } from "react";
import { userAuth } from "./Authcontext";
import { useUserRole } from "../hooks/Roles";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  return <>{session ? <>{children}</> : <Navigate to="/" />} </>;
};

export const SelectRoute = ({ children }) => {
  const { session } = userAuth();
  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const location = useLocation();

  if (roleLoading) return <div>Loading...</div>;
  if (roleError) return <div>Role Error: {roleError}</div>;

  const roleToPath = {
    admin: "/admin",
    product_manager: "/product-manager",
    user: "/user",
  };

  const allowedPath = roleToPath[role] || "/";

  if (location.pathname !== allowedPath) {
    return <Navigate to={allowedPath} replace />;
  }

  return <>{children}</>;
};
