import { useQuery } from "@tanstack/react-query";
import { supabase } from "../api/supabaseClient";
import { userAuth } from "../context/Authcontext";

export const getProducts = () => {
  const { session } = userAuth();

  const {
    data: products,
    error,
    isLoading: productLoading,
  } = useQuery({
    queryKey: ["products", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
    // Only run if there is a valid session with a user.
    enabled: Boolean(session && session.user),
    // Optionally, set staleTime so that data is considered fresh (e.g., 5 minutes).
    staleTime: 1000 * 60 * 5,
  });

  const productError = error ? error.message : null;
  return { products, productError, productLoading };
};

export const insertProduct = async (prod_name, description, quantity) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert({ prod_name, description, quantity })
      .single();
    if (error) throw error;
    console.log("Product inserted successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error inserting product:", error.message);
    return { success: false, error: error.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .single();
    if (error) throw error;
    console.log("Product deleted successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return { success: false, error: error.message };
  }
};
