import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const host = import.meta.env.VITE_LOCALHOST;
const port = import.meta.env.VITE_PORT;
const url = `http://${host}:${port}`;

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Check session on initial load and subscribe to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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

    return data.role;
  };

  // Send password recovery email
  const sendPasswordRecovery = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url + "/reset-password",
    });

    if (error) {
      console.error("Error sending password recovery email:", error.message);
      return { success: false, error };
    }
    return { success: true };
  };

  // Update user password
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error("Error updating password:", error.message);
      return { success: false, error };
    }
    return { success: true };
  };

  // Set temporary session based on token
  const setTemporarySession = async (token) => {
    const { error } = await supabase.auth.setSession({ access_token: token });
    if (error) {
      console.error("Error setting temporary session:", error.message);
      return { success: false, error };
    }
    return { success: true };
  };

  // Return the context provider with the session and auth functions
  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signInUser,
        signOutUser,
        checkUserRole,
        sendPasswordRecovery,
        updatePassword,
        setTemporarySession,
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
