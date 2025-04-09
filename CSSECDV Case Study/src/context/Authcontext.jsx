import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

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
  const signUpNewUser = async (username, email, password) => {
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
  // const signInUser = async (email, password) => {
  //   try {
  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email: email,
  //       password: password,
  //     });

  //     if (error) {
  //       console.error("Error signing in:", error.message);
  //       return { success: false, error: error.message };
  //     }
  //     return { success: true, data };
  //   } catch (error) {
  //     console.error("Error signing in:", error.message);
  //     return { success: false, error: error.message };
  //   }
  // };

  const signInUser = async (email, password) => {
    try {
      const now = new Date();

      const { data: attemptData, error: attemptError } = await supabase
        .from("login_event_logs")
        .select("*")
        .eq("email", email)
        .single();

      if (attemptError && attemptError.code !== "PGRST116") {
        console.error("Server error:", attemptError.message);
      }

      const locked_until = attemptData?.locked_until;
      if (locked_until && new Date(locked_until) > now) {
        const remaining = Math.ceil((new Date(locked_until) - now) / 1000);
        const error = new Error(
          "Account locked. Try again in (" + remaining + "s)"
        );
        return { success: false, error: error.message };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        let failedAttempts = attemptData ? attemptData.failed_attempts + 1 : 1;
        let lockedUntil = null;
        if (failedAttempts >= 5) {
          const timeout = 1; // Lock for 1 minute
          lockedUntil = new Date(now.getTime() + timeout * 60 * 1000);
          failedAttempts = 0; // Reset failed attempts after lock
        }

        await supabase.from("login_event_logs").upsert({
          email: email,
          failed_attempts: failedAttempts,
          locked_until: lockedUntil,
        });

        console.error("Error signing in:", error.message);
        return { success: false, error: error.message };
      }

      await supabase.from("login_event_logs").delete().eq("email", email);

      return { success: true, data: data };
    } catch (error) {
      console.error("Error signing in:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign out user
  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
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
