import React, { useEffect, useState } from "react";
import axios from "axios";

const ListCookProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // To store the search input

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/get/products", {
        withCredentials: true, // Ensure cookies are sent (for authentication)
      });
      console.log("API Response:", response.data);

      // Grouping products by cook and product, and summing the quantities
      const groupedProducts = response.data.data.reduce((acc, product) => {
        const key = `${product.cook.name}-${product.product.name}`; // Combine cook and product names as the key
        if (acc[key]) {
          // If the key already exists, add the quantity
          acc[key].quantity += product.quantity;
        } else {
          // Otherwise, initialize with the product data
          acc[key] = {
            cookName: product.cook.name,
            productName: product.product.name,
            quantity: product.quantity,
            assignedDate: product.assignedDate,
          };
        }
        return acc;
      }, {});

      // Convert grouped products back to an array
      const groupedProductsArray = Object.values(groupedProducts);
      setProducts(groupedProductsArray); // Update state with grouped products
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to fetch products. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("Products State:", products); // Log to check if products are being set correctly

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Cook Products</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Cook's Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update search state
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {products.length > 0 ? (
        <table className="min-w-full table-auto border-collapse shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Cook Name</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((product) =>
                // Check if product.cookName exists and then perform toLowerCase
                product.cookName?.toLowerCase().includes(search.toLowerCase()) // Filter products based on search input
              )
              .map((product) => (
                <tr
                  key={`${product.cookName}-${product.productName}`} // Unique key based on both cook and product
                  className={`${
                    product.cookName?.toLowerCase().includes(search.toLowerCase())
                      ? "bg-yellow-100" // Highlight row if cook name matches search input
                      : ""
                  } border-b`}
                >
                  <td className="px-4 py-2">{product.cookName || "Not Assigned"}</td>
                  <td className="px-4 py-2">{product.productName || "Unknown Product"}</td>
                  <td className="px-4 py-2">{product.quantity || 0}</td>
                  <td className="px-4 py-2">
                    {product.assignedDate
                      ? new Date(product.assignedDate).toLocaleString()
                      : "Unknown Date"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No products available.</p>
      )}
    </div>
  );
};

export default ListCookProducts;
// .......