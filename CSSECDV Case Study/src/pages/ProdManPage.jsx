import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getProducts, insertProduct, deleteProduct } from "../hooks/Products";
import { useNavigate } from "react-router-dom";

const ProdManPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();

  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { products, productError, productLoading } = getProducts(refreshTrigger);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const [message, setMessage] = useState("");

  // Handler for signing out the user
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Handler for navigating to Settings
  const handleSettings = async (e) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate("/settings");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Add product to catalogue list with data validation and preventing default form submission
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(productName)) {
      alert("Name must contain alphabet characters (A-Z and a-z) only.");
      return;
    }

    // Check if quantity input is more than 10 digits
    if (productQuantity.length > 10) {
      alert("Quantity cannot exceed 10 digits.");
      return;
    }
    const quantityInt = parseInt(productQuantity, 10);
    if (isNaN(quantityInt) || quantityInt < 1) {
      alert("Quantity must be a positive integer greater than 0.");
      return;
    }

    if (!productDescription.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    try {
      const result = await insertProduct(
        productName,
        productDescription,
        quantityInt
      );

      if (result.success) {
        setProductName("");
        setProductDescription("");
        setProductQuantity("");
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  // Delete product from catalogue list
  const handleDeleteProduct = async (id) => {
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        setRefreshTrigger((prev) => prev + 1);
        setMessage("Product deleted successfully.");
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (productLoading) return <p>Loading products...</p>;
  if (roleError) return <p>Error fetching user role: {roleError}</p>;
  if (productError) return <p>Error fetching products: {productError}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Manager Page</h1>
      <h2 className="text-lg mb-2">Welcome, {session?.user?.email}</h2>
      <h3 className="text-md mb-4">Role: {role ? role : "Loading..."}</h3>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
        <button
          onClick={handleSettings}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Settings
        </button>
      </div>

      {/* Product Catalogue Section */}
      <div className="bg-white p-4 shadow-md rounded-md mb-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Product Catalogue</h2>

        {/* Form to add a new product */}
        <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Name"
            maxLength="50"
            className="border border-gray-300 rounded p-2 w-full md:w-auto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            maxLength="50"
            className="border border-gray-300 rounded p-2 w-full md:w-auto"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Quantity"
            inputMode="numeric"
            maxLength="10"
            className="border border-gray-300 rounded p-2 w-full md:w-auto"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </form>

        {/* Display a message (e.g., error or deletion confirmation) */}
        {message && <p className="mb-4 text-red-500">{message}</p>}

        {/* Catalogue table list */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Quantity</th>
              <th className="p-2">Delete</th>
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
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No products yet. Add something above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProdManPage;
