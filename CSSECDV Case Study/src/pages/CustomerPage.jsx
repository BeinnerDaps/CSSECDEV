import React, { useState, useEffect } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getProducts } from "../hooks/Products"; // Assuming you have a hook to fetch products
import { useNavigate } from "react-router-dom";

const CustomerPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { products, productError, productLoading } = getProducts(); // Fetch products

  const [cart, setCart] = useState([]); // State for the cart

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSettings = async (e) => {
    e.preventDefault();
    try {
      navigate("/settings");
    } catch (error) {
      console.error("Error navigating to settings:", error.message);
    }
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.prod_name} has been added to your cart!`);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (productLoading) return <p>Loading products...</p>;
  if (roleError) return <p>Error fetching user role: {roleError}</p>;
  if (productError) return <p>Error fetching products: {productError}</p>;

  return (
    <div>
      <h1>Customer Page</h1>
      <h2>Welcome, {session?.user?.email}</h2>
      <h3>Role: {role ? role : "Loading..."}</h3>

      {/* Navigation Buttons */}
      <div>
        <button onClick={() => handleNavigation("/dashboard")}>Dashboard</button>
      </div>

      <div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <div>
        <button onClick={handleSettings}>Settings</button>
      </div>

      {/* Product Catalog Section */}
      <div className="bg-white p-4 shadow-md rounded-md mb-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Product Catalogue</h2>

        {/* Display products */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Quantity</th>
              <th className="p-2">Add to Cart</th>
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

      {/* Cart Preview */}
      <div className="mt-8">
        <h3 className="text-xl">Your Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={item.id} className="flex justify-between items-center">
              <span>{item.prod_name}</span>
              <button
                onClick={() => handleRemoveFromCart(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>

/* if wish for no remove, delete all li and replace with this:

 <li key={index}>{item.prod_name}</li>
 
 */

          ))}
        </ul>
      )}
    </div>
  </div>
);
};

export default CustomerPage;