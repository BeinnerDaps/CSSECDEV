import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { userAuth } from "../context/Authcontext";

export const useUserRole = (user_id) => {
  const { session } = userAuth();
  const [role, setRole] = useState(null);
  const [roleError, setError] = useState(null);
  const [roleLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user || !user_id) {
      setLoading(false);
      return;
    }

    const fetchUserRole = async (user_id) => {
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

    fetchUserRole(user_id);
  }, [session, user_id]);

  return { role, roleError, roleLoading };
};
