import React, { useState, useEffect } from "react";
import { userAuth } from "./Authcontext";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  return <>{session ? <>{children}</> : <Navigate to="/" />} </>;
};

export const SelectRoute = ({ children }) => {
  const { session, checkUserRole } = userAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      if (session && session.user && checkUserRole) {
        const userRole = await checkUserRole(session.user.id);
        setRole(userRole);
      }
      setLoading(false);
    };
    fetchRole();
  }, [session, checkUserRole]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const roleToPath = {
    admin: "/admin",
    product_manager: "/product-manager",
    user: "/user",
  };

  const allowedPath = roleToPath[role] || "/";

  if (location.pathname !== allowedPath) {
    return <Navigate to={allowedPath} />;
  }

  return <>{children}</>;
};
