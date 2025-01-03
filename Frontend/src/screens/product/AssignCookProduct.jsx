import React, { useState } from "react";
import axios from "axios";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import { SERVER_URL } from "../../router";

function AssignCookProduct() {
  const [formData, setFormData] = useState({
    cook: "",
    product: "",
    quantity: "",
    assignedDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      console.log("Submitting Data:", formData);
      const transformedData = {
        cook: formData.cook,
        product: formData.product,
        quantity: Number(formData.quantity), // Ensure quantity is a number
        assignedDate: formData.assignedDate, // Rename dateOfPurchase to assignedDate
      };
      const response = await axios.post(
        `${SERVER_URL}/api/v1/cooks/assign`,
        transformedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      setSuccessMessage("Product Assigned to Cook Successfully");
      setFormData({
        cook: "",
        product: "",
        quantity: "",
        assignedDate: "",
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError("Failed to Assign Cook Product");
    }
    setIsLoading(false);
  };

  return (
    <div className="m-5">
      <h1 className="text-3xl font-semibold text-neutral-900">
        Assign Product to Cook
      </h1>
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
            <input
              type="text"
              id="cook"
              name="cook"
              value={formData.cook}
              onChange={handleChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="product"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
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
              onChange={handleChange}
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
              onChange={handleChange}
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
          {isLoading ? "Assigning..." : "Assign Product"}
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

export default AssignCookProduct;
