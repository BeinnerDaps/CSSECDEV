import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { useUserRole } from "../hooks/Roles";
import { getPosts } from "../hooks/Posts";
import { useNavigate } from "react-router-dom";

const ProdManPage = () => {
  const { session, signOutUser } = userAuth();
  const navigate = useNavigate();
  
  const { role, roleError, roleLoading } = useUserRole(session?.user?.id);
  const { posts, postError, postLoading } = getPosts();

  // New state variables for product catalogue
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productQuantity, setProductQuantity] = useState(''); // Quantity input state
  const [productCatalog, setProductCatalog] = useState([]);

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

  // Add product to catalogue list with data validation
  const handleAddProduct = () => {
    // Validate product name: should only contain letters A-Z or a-z
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(productName)) {
      alert("Name must contain alphabet characters (A-Z and a-z) only.");
      return;
    }

    // Validate quantity: must be a positive integer (minimum 1)
    const quantityInt = parseInt(productQuantity, 10);
    if (isNaN(quantityInt) || quantityInt < 1) {
      alert("Quantity must be a positive integer greater than 0.");
      return;
    }

    // Optional: Validate that description is not empty (if required)
    if (!productDescription.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    // Create a new product entry
    const newProduct = {
      id: Date.now(), // simple unique ID; consider using a library like uuid for more robustness
      name: productName,
      description: productDescription,
      quantity: quantityInt,
    };

    // Update catalogue and clear the input fields
    setProductCatalog([...productCatalog, newProduct]);
    setProductName('');
    setProductDescription('');
    setProductQuantity('');
  };

  // Delete product from catalogue list
  const handleDeleteProduct = (id) => {
    setProductCatalog(productCatalog.filter(product => product.id !== id));
  };

  if (roleLoading) return <p>Loading user role...</p>;
  if (postLoading) return <p>Loading posts...</p>;
  if (roleError) return <p>Error fetching user role: {roleError}</p>;
  if (postError) return <p>Error fetching posts: {postError}</p>;

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
        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded p-2 w-full md:w-auto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="border border-gray-300 rounded p-2 w-full md:w-auto"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <input
            type="number"
            min="1"
            placeholder="Quantity"
            className="border border-gray-300 rounded p-2 w-full md:w-auto"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>

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
            {productCatalog.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">{product.name}</td>
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
            {productCatalog.length === 0 && (
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
