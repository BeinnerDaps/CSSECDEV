import { supabase } from "../api/supabaseClient";
import { userAuth } from "../context/Authcontext";
import { useQuery } from "@tanstack/react-query";

export const useUserRole = () => {
  const { session } = userAuth();
  const user_id = session?.user?.id;

  const {
    data: role,
    error,
    isLoading: roleLoading,
  } = useQuery({
    queryKey: ["userRole", user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user_id)
        .single();
      if (error) throw error;
      return data.role;
    },
    // Only run if session, session.user, and user_id exist.
    enabled: !!(session && session.user && user_id),
    staleTime: Infinity,
  });

  const roleError = error ? error.message : null;

  return { role, roleError, roleLoading };
};
