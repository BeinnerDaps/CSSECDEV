import React, { useState, useEffect } from "react";
import { userAuth } from "./Authcontext";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { session } = userAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  return <>{session ? <>{children}</> : <Navigate to="/signin" />} </>;
};

export const AdminRoute = ({ children }) => {
  const { session, checkUserRole } = userAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

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

  console.log(role);

  return <>{role === "admin" ? <>{children}</> : <Navigate to="/signin" />} </>;
};
