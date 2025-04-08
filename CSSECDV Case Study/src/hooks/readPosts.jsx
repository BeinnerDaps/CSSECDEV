import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { userAuth } from "../context/Authcontext";

const getPosts = (userId, isAdmin = false) => {
  const { session } = userAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !session.user) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("post").select("*");
        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, isAdmin]);

  return { posts, error, loading };
};

export default getPosts;
