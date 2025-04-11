import React, { useState, useEffect } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getProducts } from "../hooks/Products";
import { insertLog } from "../hooks/Logs";
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { products, productError, productLoading } = getProducts();

  const [cart, setCart] = useState([]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await insertLog(session?.user?.id, "Successfully signed out");
      await signOutUser();
      navigate("/");
    } catch (error) {
      await insertLog(session?.user?.id, "Error signing out");
      console.error("Error signing out:", error.message);
    }
  };

  const handleSettings = (e) => {
    e.preventDefault();
    navigate("/settings");
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.prod_name} has been added to your cart!`);
  };

  const handleRemoveFromCart = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (productLoading) return <p>Loading products...</p>;
  if (roleError) return <p>Error fetching user role: {roleError}</p>;
  if (productError) return <p>Error fetching products: {productError}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Page</h1>
      <h2 className="text-xl mb-4">Welcome, {session?.user?.email}</h2>
      <h3 className="text-lg mb-6">Role: {role ? role : "Loading..."}</h3>

      <div className="space-y-4 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-md shadow-md text-black">
          <h2 className="text-xl font-semibold mb-4">Product Catalogue</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Quantity</th>
                <th className="p-2 text-center">Add to Cart</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2">{product.prod_name}</td>
                  <td className="p-2">{product.description}</td>
                  <td className="p-2">{product.quantity}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cart Section */}
        <div className="bg-white p-6 rounded-md shadow-md text-black">
          <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{item.prod_name}</span>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col space-y-4 items-center">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-1/2"
          >
            Go to Dashboard
          </button>
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
    </div>
  );
};

export default CustomerPage;
