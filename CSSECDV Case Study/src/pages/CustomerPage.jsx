import React from "react";
import { userAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import getPosts from "../hooks/getPosts";

const mainpage = () => {
  const { session, signOutUser, checkUserRole } = userAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const { posts, loading, error } = getPosts();

  useEffect(() => {
    const fetchRole = async () => {
      if (session && session.user) {
        const userRole = await checkUserRole(session.user.id);
        setRole(userRole);
      }
    };
    fetchRole();
  }, [session, checkUserRole]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      <h1>Customer Page</h1>
      <h1>Welcome, {session?.user?.email}</h1>
      <h2>Role: {role ? role : "Loading..."}</h2>

      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  );
};

export default mainpage;
