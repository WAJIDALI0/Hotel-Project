import React, { useEffect, useState } from "react";
import axios from "axios";

const GetCookProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // To store the search input

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/get/products", {
        withCredentials: true, // Ensure cookies are sent (for authentication)
      });
      console.log("API Response:", response.data);
      setProducts(response.data.data); // Update state with API data
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
                product.cookName?.toLowerCase().includes(search.toLowerCase()) // Filter products based on search input
              )
              .map((product) => (
                <tr
                  key={product._id}
                  className={`${
                    product.cookName?.toLowerCase().includes(search.toLowerCase())
                      ? "bg-yellow-100" // Highlight row if cook name matches search input
                      : ""
                  } border-b`}
                >
                  <td className="px-4 py-2">{product.cookName || "Not Assigned"}</td>
                  <td className="px-4 py-2">{product.productName || "Unknown Product"}</td>
                  <td className="px-4 py-2">{product.totalQuantity || 0}</td>
                  <td className="px-4 py-2">
                    {product.latestAssignedDate
                      ? new Date(product.latestAssignedDate).toLocaleString()
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

export default GetCookProducts;