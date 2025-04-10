import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { userAuth } from "../context/Authcontext";

export const getProducts = (refreshTrigger) => {
  const { session } = userAuth();
  const [products, setProducts] = useState(null);
  const [productError, setError] = useState(null);
  const [productLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session, refreshTrigger]);

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
