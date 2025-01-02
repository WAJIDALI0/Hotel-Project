import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import { SERVER_URL } from "../../router";

function AddNewProductScreen() {
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    quantity: "",
    price: "",
    perUnitPrice: "",
    dateOfPurchase: "",
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
    try {
      console.log("formData", formData);
      
      const response = await axios.post(
        `${SERVER_URL}/api/v1/products`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Product added successfully");
      setFormData({
        name: "",
        weight: "",
        quantity: "",
        price: "",
        perUnitPrice: "",
        dateOfPurchase: "",
      });
    } catch (error) {
      setError("Failed to add product");
    }
    setIsLoading(false);
  };

  return (
    <div className="m-5">
      <h1 className="text-3xl font-semibold text-neutral-900">Add New Product</h1>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="weight"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Weight
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
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
              htmlFor="price"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="perUnitPrice"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Per Unit Price
            </label>
            <input
              type="number"
              id="perUnitPrice"
              name="perUnitPrice"
              value={formData.perUnitPrice}
              onChange={handleChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="dateOfPurchase"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
              Date of Purchase
            </label>
            <input
              type="datetime-local"
              id="dateOfPurchase"
              name="dateOfPurchase"
              value={formData.dateOfPurchase}
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
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
      <br />
      {successMessage && (
        <ShowSuccessMesasge
          children={<div className="text-gray-900 text-lg">{successMessage}</div>}
        />
      )}
    </div>
  );
}

export default AddNewProductScreen;
