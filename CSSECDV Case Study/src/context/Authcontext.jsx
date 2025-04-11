import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { insertLog } from "../hooks/Logs";

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
      await insertLog(session?.user?.id, "Error signing up");
      console.error("Error signing up:", error.message);
      return { success: false, error };
    }
    await insertLog(session?.user?.id, "Successfully signed up");
    return { success: true, data };
  };

  // Sign in user
  const signInUser = async (email, password) => {
    try {
      const now = new Date();

      const { data: attemptData, error: attemptError } = await supabase
        .from("login_event_logs")
        .select("*")
        .eq("email", email)
        .single();

      if (attemptError && attemptError.code !== "PGRST116") {
        await insertLog(session?.user?.id, "Attempt Error");
        console.error("Server error:", attemptError.message);
        throw attemptError;
      }

      const locked_until = attemptData?.locked_until;
      if (locked_until && new Date(locked_until) > now) {
        await insertLog(session?.user?.id, "Attempt Error: Locked Account");
        const remaining = Math.ceil((new Date(locked_until) - now) / 1000);
        const error = new Error(
          "Account locked. Try again in (" + remaining + "s)"
        );
        throw error;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        let failedAttempts = attemptData ? attemptData.failed_attempts + 1 : 1;
        let lockedUntil = null;
        if (failedAttempts >= 5) {
          const timeout = 1;
          lockedUntil = new Date(now.getTime() + timeout * 60 * 1000);
          failedAttempts = 0;

          if (session) {
            await supabase.auth.signOut();
          }
        }

        await supabase.from("login_event_logs").upsert({
          email: email,
          failed_attempts: failedAttempts,
          locked_until: lockedUntil,
        });

        throw error;
      }

      await supabase.from("login_event_logs").delete().eq("email", email);

      return { success: true, data: data };
    } catch (error) {
      await insertLog(session?.user?.id, "Error Signing In");
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
      await insertLog(session?.user?.id, "Error sending password recovery email");
      console.error("Error sending password recovery email:", error.message);
      return { success: false, error };
    }
    await insertLog(session?.user?.id, "Successfully sent password recovery email");
    return { success: true };
  };

  // Update user password
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      await insertLog(session?.user?.id, "Successfully updated password");
      return { success: true };
    } catch (error) {
      await insertLog(session?.user?.id, "Error updating password");
      console.error("Error updating password:", error);
      return { success: false, error: error.details || error.message };
    }
  };

  // Set temporary session based on token
  const setTemporarySession = async (token) => {
    const { data, error } = await supabase.auth.setSession({
      access_token: token,
    });
    if (error) throw error;
    setSession(data.session);
    return { success: true };
  };

  const getSecurityQuestions = async (user_id) => {
    const { data, error } = await supabase
      .from("user_security")
      .select("security_question1, security_question2")
      .eq("user_id", user_id)
      .single();

    if (error) {
      await insertLog(session?.user?.id, "Error fetching security questions");
      console.error("Error fetching security questions:", error.message);
      return { success: false, error };
    }
    await insertLog(session?.user?.id, "Successfully fetched security questions");
    return { success: true, data };
  };

  const setSecurityAnswers = async (user_id, answer1, answer2) => {
    const { error } = await supabase.from("user_security").upsert({
      user_id,
      security_answer1: answer1,
      security_answer2: answer2,
    });

    if (error) {
      await insertLog(session?.user?.id, "Error setting security questions");
      console.error("Error setting security questions:", error.message);
      return { success: false, error };
    }
    await insertLog(session?.user?.id, "Successfully set security questions");
    return { success: true };
  };

  const checkSecurityAnswers = async (user_id, answer1, answer2) => {
    const { data, error } = await supabase
      .from("user_security")
      .select("security_answer1, security_answer2")
      .eq("user_id", user_id)
      .single();

    if (error) {
      await insertLog(session?.user?.id, "Error checking security answers");
      console.error("Error checking security answers:", error.message);
      return { success: false, error: error.message };
    }

    if (!data) {
      await insertLog(session?.user?.id, "Error No security answers found");
      return { success: false, error: "No security answers found" };
    }

    if (
      data.security_answer1 !== answer1 ||
      data.security_answer2 !== answer2
    ) {
      await insertLog(session?.user?.id, "Error Invalid security answers");
      return { success: false, error: "Invalid security answers" };
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
        getSecurityQuestions,
        setSecurityAnswers,
        checkSecurityAnswers,
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
