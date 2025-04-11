import React from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getProducts } from "../hooks/Products";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();
  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { products, productError, productLoading } = getProducts();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSettings = (e) => {
    e.preventDefault();
    navigate("/settings");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (roleLoading || productLoading) return <p>Loading...</p>;
  if (roleError) return <p>Error fetching role: {roleError}</p>;
  if (productError) return <p>Error fetching products: {productError}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <h2 className="text-xl mb-2">Welcome, {session?.user?.email}</h2>
      <h3 className="text-lg mb-6">Role: {role}</h3>

      {/* Read-Only Product Viewer */}
      <div className="bg-white text-black p-6 rounded-md shadow-md w-full max-w-4xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">{product.prod_name}</td>
                <td className="p-2">{product.description}</td>
                <td className="p-2">{product.quantity}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Role-Based Navigation Buttons */}
      <div className="space-y-4">
        {role === "admin" && (
          <button
            onClick={() => handleNavigation("/admin")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Admin Page
          </button>
        )}

        {role === "product_manager" && (
          <button
            onClick={() => handleNavigation("/product-manager")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Product Manager Page
          </button>
        )}

        {role === "user" && (
          <button
            onClick={() => handleNavigation("/user")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Customer Page
          </button>
        )}

        <button
          onClick={handleSettings}
          className="bg-green-500 text-white rounded-md py-2 px-4 w-1/2"
        >
          Settings
        </button>

        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white rounded-md py-2 px-4 w-1/2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
