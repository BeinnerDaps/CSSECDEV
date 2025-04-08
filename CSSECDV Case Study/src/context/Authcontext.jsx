import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Sign up new user
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // Sign in user
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error signing in:", error.message);
        return { success: false, error };
      }
      console.log("User signed in:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  // Sign out user
  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Check user role
  const checkUserRole = async (user_id) => {
    const { data, error } = await supabase
      .from("user")
      .select("role")
      .eq("id", user_id)
      .single();

    if (error) {
      console.error("Error fetching user role:", error.message);
      return null;
    }

    const validRoles = ["admin", "product_manager", "customer"];
    if (validRoles.includes(data.role)) {
      return data.role;
    } else {
      return null;
    }
  };

  // Get posts
  const getPosts = async () => {
    const { data, error } = await supabase.from("post").select("*");
    if (error) {
      console.error("Error fetching posts:", error.message);
      return null;
    }
    return data;
  };

  // Check session on initial load and subscribe to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Return the context provider with the session and auth functions
  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signInUser,
        signOutUser,
        checkUserRole,
        getPosts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
