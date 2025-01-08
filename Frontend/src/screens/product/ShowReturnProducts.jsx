import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { SERVER_URL } from "../../router";

function ShowReturnProducts() {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/get/return`, {
        withCredentials: true,
      });
  
      console.log("API Response Data:", response.data);
  
      if (!response.data || !Array.isArray(response.data.returnedProducts)) {
        throw new Error("Invalid or empty data from API.");
      }
  
      // Remove or update the filtering logic
      const returnedProducts = response.data.returnedProducts;
  
      console.log("Returned Products:", returnedProducts);
      setProducts(returnedProducts);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-5">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Returned Products</h1>
      </header>

      {error && (
        <div className="text-red-500 mt-4">
          {error}{" "}
          <button className="underline" onClick={fetchData}>
            Retry
          </button>
        </div>
      )}

      <div className="border rounded-md border-neutral-700 mt-4">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-2">COOK NAME</th>
                <th className="px-4 py-2">PRODUCT NAME</th>
                <th className="px-4 py-2">QUANTITY</th> {/* Added Quantity Column */}
                <th className="px-4 py-2">RETURNED DATE</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-red-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow key={product._id} product={product} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product }) {
  const formattedDate = product.returnedDate
    ? new Date(product.returnedDate).toLocaleDateString()
    : "N/A";

  const cookName = product.cook?.name || "N/A";
  const productName = product.product?.name || "N/A";
  const productQuantity = product.quantity || "N/A"; // Display quantity

  return (
    <tr className="border-b hover:bg-teal-50 hover:text-teal-700">
      <td className="px-4 py-2">{cookName}</td>
      <td className="px-4 py-2">{productName}</td>
      <td className="px-4 py-2">{productQuantity}</td> {/* Display Quantity */}
      <td className="px-4 py-2">{formattedDate}</td>
    </tr>
  );
}

export default ShowReturnProducts;
