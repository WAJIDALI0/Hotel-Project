import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import { SERVER_URL } from "../../router";

function ReturnProduct() {
  const [formData, setFormData] = useState({
    cook: "",
    product: "",
    quantity: "",
    assignedDate: "",
  });

  const [cooks, setCooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch cooks and products
  useEffect(() => {
    const fetchCooksAndProducts = async () => {
      try {
        const cooksResponse = await axios.get(`${SERVER_URL}/api/v1/get/cooks`, {
          withCredentials: true,
        });
        const productsResponse = await axios.get(`${SERVER_URL}/api/v1/products`, {
          withCredentials: true,
        });

        console.log("Cooks API Response:", cooksResponse.data);
        console.log("Products API Response:", productsResponse.data);

        // Map the cooks and products
        setCooks(cooksResponse.data);
        setProducts(productsResponse.data.data);
      } catch (error) {
        console.error("Error fetching cooks/products:", error.message);
        setError("Failed to fetch cooks or products.");
      }
    };

    fetchCooksAndProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const transformedData = {
        cook: formData.cook, // Pass ObjectId of the cook
        product: formData.product, // Pass ObjectId of the product
        quantity: Number(formData.quantity),
        assignedDate: formData.assignedDate,
      };

      await axios.post(`${SERVER_URL}/api/v1/return/product`, transformedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Product Returned Successfully");
      setFormData({
        cook: "",
        product: "",
        quantity: "",
        assignedDate: "",
      });
    } catch (error) {
      console.error("Error returning product:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to return product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-3xl font-semibold text-neutral-900">Return Product</h1>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="cook"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Cook Name
            </label>
            <select
              id="cook"
              name="cook"
              value={formData.cook}
              onChange={handleInputChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            >
              <option value="" disabled>
                Select a cook
              </option>
              {cooks.map((cook) => (
                <option key={cook._id} value={cook._id}>
                  {cook.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="product"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Product Name
            </label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="assignedDate"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Assigned Date
            </label>
            <input
              type="datetime-local"
              id="assignedDate"
              name="assignedDate"
              value={formData.assignedDate}
              onChange={handleInputChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Returning..." : "Return Product"}
        </button>
      </form>
      <br />
      {successMessage && (
        <ShowSuccessMesasge>
          <div className="text-gray-900 text-lg">{successMessage}</div>
        </ShowSuccessMesasge>
      )}
    </div>
  );
}

export default ReturnProduct;
