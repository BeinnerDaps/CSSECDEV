import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { userAuth } from "../context/Authcontext";

export const checkUserRole = (user_id) => {
  const { session } = userAuth();
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !session.user || !user_id) {
      setLoading(false);
      return;
    }

    const checkUserRole = async (user_id) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user_id)
          .single();
        if (error) throw error;
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching user role:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole(user_id);
  }, [session, user_id]);

  return role;
};
