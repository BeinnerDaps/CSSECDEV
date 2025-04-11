import React, { useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getProducts, insertProduct, deleteProduct } from "../hooks/Products";
import { insertLog } from "../hooks/Logs";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ProdManPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { role, roleError, roleLoading } = useUserRole();
  const { products, productError, productLoading } = getProducts();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(productName)) {
      await insertLog(session?.user?.id, "Invalid Product Name Input");
      alert("Name must contain alphabet characters (A-Z and a-z) only.");
      return;
    }

    if (productQuantity.length > 10) {
      await insertLog(session?.user?.id, "Invalid Quantity Size Input");
      alert("Quantity cannot exceed 10 digits.");
      return;
    }

    const quantityInt = parseInt(productQuantity, 10);
    if (isNaN(quantityInt) || quantityInt < 1) {
      await insertLog(session?.user?.id, "Invalid Quantity Amount Input");
      alert("Quantity must be a positive integer greater than 0.");
      return;
    }

    if (!productDescription.trim()) {
      await insertLog(session?.user?.id, "Description cannot be empty");
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
        await insertLog(session?.user?.id, "Product Successfully Added: " + productName);
        setProductName("");
        setProductDescription("");
        setProductQuantity("");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        setSuccess("Product added successfully.");
        setMessage("");
      } else {
        setMessage("Error: " + result.error);
        setSuccess("");
      }
    } catch (error) {
      await insertLog(session?.user?.id, "Error Adding Product: " + productName);
      console.error("Error adding product:", error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        await insertLog(session?.user?.id, "Product Successfully Deleted: " + productName);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        setSuccess("Product deleted successfully.");
        setMessage("");
      } else {
        await insertLog(session?.user?.id, "Error Deleting Product: " + productName);
        setMessage("Error: " + result.error);
        setSuccess("");
      }
    } catch (error) {
      await insertLog(session?.user?.id, "Error Deleting Product: " + productName);
      console.error("Error deleting product:", error.message);
    }
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
      <h1 className="text-2xl font-bold mb-6">Product Manager Page</h1>
      <h2 className="text-xl mb-4">Welcome, {session?.user?.email}</h2>
      <h3 className="text-lg mb-6">Role: {role ? role : "Loading..."}</h3>

      <div className="space-y-6 w-full max-w-4xl">

        <div className="bg-white p-6 rounded-md shadow-md text-black">
          <h2 className="text-xl font-semibold mb-4">Product Catalogue</h2>

          <form
            onSubmit={handleAddProduct}
            className="flex flex-col md:flex-row gap-2 mb-4"
          >
            <input
              type="text"
              placeholder="Name"
              maxLength="50"
              className="border border-gray-300 rounded p-2 w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              maxLength="50"
              className="border border-gray-300 rounded p-2 w-full"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Quantity"
              inputMode="numeric"
              maxLength="10"
              className="border border-gray-300 rounded p-2 w-full"
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

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {success}
            </div>
          )}
          {message && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {message}
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Quantity</th>
                <th className="p-2 text-center">Delete</th>
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

export default ProdManPage;
