import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { userAuth } from "../context/Authcontext";

export const getProducts = () => {
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
        const { data, error } = await supabase
          .from("products")
          .select("*");
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
  }, [session]);

  return { products, productError, productLoading };
};

export const insertProducts = (prod_name, description, quantity) => {
    const { session } = userAuth();
    const [products, setProducts] = useState(null);
    const [productError, setError] = useState(null);
    const [productLoading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!session || !session.user) {
        setLoading(false);
        return;
      }
  
      const fetchProducts = async (prod_name, description, quantity) => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("products")
            .upsert({
                prod_name, description, quantity
            });
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
    }, [session, prod_name, description, quantity]);
  
    return { products, productError, productLoading };
  };
